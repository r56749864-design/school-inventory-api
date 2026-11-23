
const express = require('express');
const router = express.Router();

const {
  getAllActivityLogs
} = require('../controller/activityLogController');

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

/**
 * @swagger
 * tags:
 *   name: Activity Logs
 *   description: Activity log management
 */

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Get all activity logs (Admin)
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activityType
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by activity type
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter until date
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  '/',
  protect,
  restrictTo('admin'),
  getAllActivityLogs
);

module.exports = router;
