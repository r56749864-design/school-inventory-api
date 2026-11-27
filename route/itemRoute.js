
const express = require('express');
const router = express.Router();

const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require('../controller/itemController');

const {
  createItemValidator,
  updateItemValidator,
  itemIdValidator
} = require('../validator/itemValidator');

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item management
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *         description: Filter by item condition
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field used for sorting
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search items by keyword
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 */
router.get('/', getAllItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 *       404:
 *         description: Item not found
 */
router.get('/:id', itemIdValidator, getItem);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Item created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  protect,
  restrictTo('admin'),
  createItemValidator,
  createItem
);

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  itemIdValidator,
  updateItemValidator,
  updateItem
);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Archive an item
 *     tags: [Items]
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item archived successfully
 *       404:
 *         description: Item not found
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  itemIdValidator,
  deleteItem
);

module.exports = router;
