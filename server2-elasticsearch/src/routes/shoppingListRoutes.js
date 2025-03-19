const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');

/**
 * @swagger
 * /api/shopping-lists:
 *   put:
 *     summary: Save or update a shopping list
 *     tags: [Shopping Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingList'
 *     responses:
 *       201:
 *         description: Shopping list saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 id:
 *                   type: string
 *                 result:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.put('/', shoppingListController.saveShoppingList);

/**
 * @swagger
 * /api/shopping-lists/{id}:
 *   get:
 *     summary: Get a shopping list by ID
 *     tags: [Shopping Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shopping list ID
 *     responses:
 *       200:
 *         description: Shopping list data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       404:
 *         description: Shopping list not found
 *       500:
 *         description: Server error
 */
router.get('/:id', shoppingListController.getShoppingListById);

/**
 * @swagger
 * /api/shopping-lists/user/{userId}:
 *   get:
 *     summary: Get all shopping lists for a user
 *     tags: [Shopping Lists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of shopping lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lists:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShoppingList'
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', shoppingListController.getUserShoppingLists);

/**
 * @swagger
 * /api/shopping-lists/{id}:
 *   delete:
 *     summary: Delete a shopping list
 *     tags: [Shopping Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shopping list ID
 *     responses:
 *       200:
 *         description: Shopping list deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: string
 *       404:
 *         description: Shopping list not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', shoppingListController.deleteShoppingList);

/**
 * @swagger
 * /api/shopping-lists/:
 *   get:
 *     summary: Get all shopping list
 *     tags: [Shopping Lists]
 *      
 *     responses:
 *       200:
 *         description: List of shopping lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lists:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShoppingList'
 * 
 *       500:
 *         description: Server error
 */
router.get('/', shoppingListController.getAllShoppingLists);


module.exports = router;