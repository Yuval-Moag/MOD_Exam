const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Elasticsearch client with fallback
const createClient = () => {
  const config = {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
  };
  
  // Add auth if username and password are provided
  if (process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD) {
    config.auth = {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    };
  }
  
  // Add SSL options if using Elastic Cloud
  if (process.env.ELASTICSEARCH_CLOUD_ID) {
    config.cloud = {
      id: process.env.ELASTICSEARCH_CLOUD_ID
    };
    // Cloud ID requires authentication
    if (!config.auth && process.env.ELASTICSEARCH_API_KEY) {
      config.auth = {
        apiKey: process.env.ELASTICSEARCH_API_KEY
      };
    }
  }
  
  // Log connection info (excluding sensitive data)
  console.log(`Connecting to Elasticsearch at: ${config.node || 'Cloud ID'}`);
  
  return new Client(config);
};

// Create client instance
const client = createClient();

// Test connection
const testConnection = async () => {
  try {
    const info = await client.info();
    console.log(`Connected to Elasticsearch ${info.version.number}`);
    return true;
  } catch (error) {
    console.error('Elasticsearch connection failed:', error.message);
    return false;
  }
};
// In your elasticsearch.js setup function
async function setupIndex() {
    const indexName = 'shopping_lists';

    try {
      const indexExists = await client.indices.exists({ index: indexName });
      
      if (!indexExists) {
        await client.indices.create({
          index: 'shopping_lists',
          body: {
            settings: {
              analysis: {
                analyzer: {
                  hebrew_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: ["lowercase"]
                  }
                }
              }
            },
            mappings: {
              properties: {
                shoppingList: {
                  type: 'nested',
                  properties: {
                    categoryId: { type: 'integer' },
                    categoryName: { 
                      type: 'text',
                      analyzer: 'hebrew_analyzer' 
                    },
                    products: {
                      type: 'nested',
                      properties: {
                        id: { type: 'integer' },
                        name: { 
                          type: 'text',
                          analyzer: 'hebrew_analyzer'
                        },
                        quantity: { type: 'integer' }
                      }
                    }
                  }
                },
                userDetails: {
                  properties: {
                    fullName: { 
                      type: 'text',
                      analyzer: 'hebrew_analyzer',
                      fields: {
                        keyword: { type: 'keyword' }
                      }
                    },
                    address: { type: 'text', analyzer: 'hebrew_analyzer' },
                    email: { type: 'keyword' }
                  }
                },
                orderDate: { type: 'date' }
              }
            }
          }
        });
        console.log('Index created successfully');
      }
    //   else{
    //     console.log(`Deleting existing index: ${indexName}`);
    //     await client.indices.delete({ index: indexName });
    //   }
      return true;
    } catch (error) {
      console.error('Error setting up index:', error);
      throw error;
    }
  }
  
module.exports = {
  client,
  testConnection, setupIndex
};