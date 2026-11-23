
const express = require('express');
const router = express.Router();

const {
  createLoan,
  verifyLoan,
  getMyLoans,
  getAllLoans
} = require('../controller/loanController');

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management
 */

router.use(protect);

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Submit a loan request
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 description: Item ID
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Loan request created successfully
 *       400:
 *         description: Invalid request or insufficient stock
 */
router.post('/', createLoan);

/**
 * @swagger
 * /api/loans/my:
 *   get:
 *     summary: Get my loan history
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loan history retrieved successfully
 */
router.get('/my', getMyLoans);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans (Admin)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All loans retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/', restrictTo('admin'), getAllLoans);

/**
 * @swagger
 * /api/loans/{id}/verify:
 *   patch:
 *     summary: Approve or reject a loan (Admin)
 *     tags: [Loans]
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
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *     responses:
 *       200:
 *         description: Loan verification completed
 *       403:
 *         description: Admin access required
 */
router.patch('/:id/verify', restrictTo('admin'), verifyLoan);

module.exports = router;
