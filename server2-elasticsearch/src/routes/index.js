const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');

/**
 * @route   PUT /api/shopping-lists
 * @desc    Save or update a shopping list
 * @access  Private
 */
router.put('/', shoppingListController.saveShoppingList);

/**
 * @route   GET /api/shopping-lists/:id
 * @desc    Get a shopping list by ID
 * @access  Private
 */
router.get('/:id', shoppingListController.getShoppingListById);

/**
 * @route   GET /api/shopping-lists/user/:userId
 * @desc    Get all shopping lists for a user
 * @access  Private
 */
router.get('/user/:userId', shoppingListController.getUserShoppingLists);

/**
 * @route   DELETE /api/shopping-lists/:id
 * @desc    Delete a shopping list
 * @access  Private
 */
router.delete('/:id', shoppingListController.deleteShoppingList);

module.exports = router;