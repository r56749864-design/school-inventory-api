const ActivityLog = require('../model/activityLog');
const catchAsync = require('../util/catchAsync');

const getAllActivityLogs = catchAsync(async (req, res, next) => {
  const filter = {
    archived: false
  };

  // Filter by activity type
  if (req.query.activityType) {
    filter.activityType = req.query.activityType;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    filter.created_at = {};

    if (req.query.startDate) {
      filter.created_at.$gte = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.created_at.$lte = endDate;
    }
  }

  const activityLogs = await ActivityLog.find(filter)
    .populate('user', 'name email')
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    results: activityLogs.length,
    data: {
      activityLogs
    }
  });
});

module.exports = {
  getAllActivityLogs
};