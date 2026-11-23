
const express = require('express');
const router = express.Router();

const {
  createExternalActivity
} = require('../controller/externalActivityController');

const {
  createExternalActivityValidator
} = require('../validator/externalActivityValidator');

const verifyApiKey = require('../middleware/verifyApiKey');

/**
 * @swagger
 * tags:
 *   name: External Activity
 *   description: External activity callback
 */

/**
 * @swagger
 * /api/external/activity:
 *   post:
 *     summary: Receive external activity callback
 *     tags: [External Activity]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: External API authentication key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: External activity created successfully
 *       401:
 *         description: Invalid or missing API key
 *       400:
 *         description: Invalid request data
 */
router.post(
  '/activity',
  verifyApiKey,
  createExternalActivityValidator,
  createExternalActivity
);

module.exports = router;
