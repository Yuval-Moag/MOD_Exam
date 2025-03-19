// const { Client } = require('@elastic/elasticsearch');
const { client } = require('../config/elasticsearch'); // Adjust path as needed

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Elasticsearch client
/* const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  }
});
 */
// Index name for shopping lists
const SHOPPING_LIST_INDEX = 'shopping-lists';


/**
 * Save or update a shopping list
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function saveShoppingList(req, res) {
    try {
      const shoppingList = req.body;
      
      // Validate required fields
      if (!shoppingList) {
        return res.status(400).json({ error: 'Shopping list data is required' });
      }
      
      if (!shoppingList.userDetails) {
        return res.status(400).json({ error: 'Shopping list must include user information' });
      }
      
      // Add timestamps
      const now = new Date().toISOString();
      if (!shoppingList.createdAt) {
        shoppingList.createdAt = now;
      }
      shoppingList.updatedAt = now;
      
      // Generate ID if not provided (adjust as needed for your data structure)
      const documentId = shoppingList.id || `${Date.now()}`;
      
      // Save to Elasticsearch using the shared client
      const response = await client.index({
        index: SHOPPING_LIST_INDEX,
        id: documentId,
        body: shoppingList,
        refresh: true
      });
      
      // Return success response
      res.status(201).json({
        success: true,
        id: response._id,
        result: response.result
      });
      
    } catch (error) {
      console.error('Error saving shopping list:', error);
      res.status(500).json({ 
        error: 'Failed to save shopping list',
        message: error.message
      });
    }
  }

/**
 * Get a shopping list by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getShoppingListById(req, res) {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id) {
      return res.status(400).json({ error: 'Shopping list ID is required' });
    }
    
    // Get from Elasticsearch
    try {
      const response = await client.get({
        index: SHOPPING_LIST_INDEX,
        id
      });
      
      res.json({
        id: response._id,
        ...response._source
      });
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ error: 'Shopping list not found' });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Error retrieving shopping list:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve shopping list',
      message: error.message
    });
  }
}

/**
 * Get all shopping lists for a user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getUserShoppingLists(req, res) {
  try {
    const { userId } = req.params;
    
    // Validate user ID
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Ensure index exists
    const indexExists = await client.indices.exists({ index: SHOPPING_LIST_INDEX });
    if (!indexExists) {
      return res.json({ lists: [] });
    }
    
    // Search for user's shopping lists
    const response = await client.search({
      index: SHOPPING_LIST_INDEX,
      body: {
        query: {
          term: {
            "user.id": userId
          }
        },
        sort: [
          { updatedAt: { order: "desc" } }
        ]
      }
    });
    
    // Format response
    const shoppingLists = response.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));
    
    res.json({ lists: shoppingLists });
    
  } catch (error) {
    console.error('Error retrieving user shopping lists:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve user shopping lists',
      message: error.message
    });
  }
}

/**
 * Delete a shopping list
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteShoppingList(req, res) {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id) {
      return res.status(400).json({ error: 'Shopping list ID is required' });
    }
    
    // Delete from Elasticsearch
    try {
      const response = await client.delete({
        index: SHOPPING_LIST_INDEX,
        id,
        refresh: true
      });
      
      res.json({
        success: true,
        result: response.result
      });
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ error: 'Shopping list not found' });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    res.status(500).json({ 
      error: 'Failed to delete shopping list',
      message: error.message
    });
  }
}

async function getAllShoppingLists(req, res) {
    try {
      // Get pagination parameters with defaults
      const size = parseInt(req.query.size) || 10;
      const from = parseInt(req.query.from) || 0;
      
      // Search for all shopping lists with pagination
      const response = await client.search({
        index: SHOPPING_LIST_INDEX,
        body: {
          query: {
            match_all: {} // Get all documents
          },
          sort: [
            { "orderDate": { order: "desc" } } // Sort by order date, newest first
          ],
          size: size,
          from: from
        }
      });
      
      // Format response
      const total = response.hits.total.value;
      const shoppingLists = response.hits.hits.map(hit => ({
        id: hit._id,
        ...hit._source
      }));
      
      res.json({
        total: total,
        from: from,
        size: size,
        lists: shoppingLists
      });
      
    } catch (error) {
      console.error('Error retrieving shopping lists:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve shopping lists',
        message: error.message
      });
    }
  }

module.exports = {
  saveShoppingList,
  getShoppingListById,
  getUserShoppingLists,
  deleteShoppingList,
  getAllShoppingLists
};