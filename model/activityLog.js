const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  activityType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    default: 'internal'
  },

  created_by: {
    type: String,
    default: 'system'
  },
  updated_by: {
    type: String,
    default: 'system'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  archived: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model(
  'ActivityLog',
  activityLogSchema,
  'activity_logs'
);
