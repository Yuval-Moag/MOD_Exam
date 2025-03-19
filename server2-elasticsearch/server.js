const express = require('express');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const shoppingListRoutes = require('./src/routes/shoppingListRoutes');

const { setupIndex, client: esClient  } = require('./src/config/elasticsearch');

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Initialize Elasticsearch client
/* const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  }
}); */

// Health check route
app.get('/health', async (req, res) => {
  try {
    const health = await esClient.cluster.health();
    res.json({ status: 'OK', elasticsearch: health });
  } catch (error) {
    console.error('Elasticsearch health check failed:', error);
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { index, query, size = 10, from = 0 } = req.body;
    
    if (!index) {
      return res.status(400).json({ error: 'Index name is required' });
    }
    
    const response = await esClient.search({
      index,
      body: {
        query: query || { match_all: {} },
        size,
        from
      }
    });
    
    res.json({
      total: response.hits.total.value,
      hits: response.hits.hits.map(hit => ({
        id: hit._id,
        score: hit._score,
        ...hit._source
      }))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Document operations

// Create or update document
app.post('/api/documents/:index', async (req, res) => {
  try {
    const { index } = req.params;
    const { id, document } = req.body;
    
    if (!document) {
      return res.status(400).json({ error: 'Document body is required' });
    }
    
    const response = id 
      ? await esClient.index({ index, id, body: document, refresh: true })
      : await esClient.index({ index, body: document, refresh: true });
    
    res.status(201).json({ 
      result: response.result,
      id: response._id
    });
  } catch (error) {
    console.error('Document creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get document by ID
app.get('/api/documents/:index/:id', async (req, res) => {
  try {
    const { index, id } = req.params;
    
    const response = await esClient.get({
      index,
      id
    });
    
    if (response.found) {
      res.json({
        id: response._id,
        ...response._source
      });
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: 'Document not found' });
    } else {
      console.error('Document retrieval error:', error);
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete document by ID
app.delete('/api/documents/:index/:id', async (req, res) => {
  try {
    const { index, id } = req.params;
    
    const response = await esClient.delete({
      index,
      id,
      refresh: true
    });
    
    res.json({ result: response.result });
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: 'Document not found' });
    } else {
      console.error('Document deletion error:', error);
      res.status(500).json({ error: error.message });
    }
  }
});

// Bulk operations
app.post('/api/bulk', async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({ error: 'Operations array is required' });
    }
    
    const response = await esClient.bulk({
      refresh: true,
      body: operations
    });
    
    res.json({
      took: response.took,
      errors: response.errors,
      items: response.items
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/shopping-lists', shoppingListRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
setupIndex()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Elasticsearch connected to ${process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'}`);
    });
  })
  .catch(err => {
    console.error('Failed to set up Elasticsearch index:', err);
    process.exit(1);
  });
  

module.exports = app;