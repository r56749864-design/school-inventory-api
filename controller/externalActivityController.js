
const ActivityLog = require('../model/activityLog');
const catchAsync = require('../util/catchAsync');

const createExternalActivity = catchAsync(async (req, res, next) => {
  const { activityType, description, userId } = req.body;

  const activityLog = await ActivityLog.create({
    user: userId || null,
    activityType,
    description,
    source: 'external',
    created_by: userId ? String(userId) : 'external',
    updated_by: userId ? String(userId) : 'external'
  });

  res.status(201).json({
    success: true,
    message: 'External activity recorded successfully',
    data: {
      activityLog
    }
  });
});

module.exports = {
  createExternalActivity
};
