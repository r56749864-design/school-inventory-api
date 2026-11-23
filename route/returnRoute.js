
const express = require('express');
const router = express.Router();

const {
  createReturn,
  getMyReturns,
  getAllReturns,
  verifyReturn
} = require('../controller/returnController');

const {
  createReturnValidator,
  verifyReturnValidator
} = require('../validator/returnValidator');

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

/**
 * @swagger
 * tags:
 *   name: Returns
 *   description: Return management
 */

// Semua endpoint membutuhkan autentikasi
router.use(protect);

/**
 * @swagger
 * /api/returns/my:
 *   get:
 *     summary: Get my return history
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return history retrieved successfully
 */
router.get('/my', getMyReturns);

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Get all returns (Admin)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All returns retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/', restrictTo('admin'), getAllReturns);

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Submit a return request
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loan:
 *                 type: string
 *                 description: Loan ID
 *     responses:
 *       201:
 *         description: Return request submitted successfully
 *       400:
 *         description: Invalid return request
 */
router.post('/', createReturnValidator, createReturn);

/**
 * @swagger
 * /api/returns/{id}/verify:
 *   patch:
 *     summary: Verify a return request (Admin)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *     responses:
 *       200:
 *         description: Return request verified successfully
 *       403:
 *         description: Admin access required
 */
router.patch(
  '/:id/verify',
  restrictTo('admin'),
  verifyReturnValidator,
  verifyReturn
);

module.exports = router;
