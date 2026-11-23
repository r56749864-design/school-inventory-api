const ActivityLog = require('../model/activityLog');

const createActivityLog = async ({
  userId,
  activityType,
  description
}) => {
  return await ActivityLog.create({
    user: userId,
    activityType,
    description,
    source: 'internal',
    created_by: String(userId),
    updated_by: String(userId)
  });
};

module.exports = createActivityLog;
