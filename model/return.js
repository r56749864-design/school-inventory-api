const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  returnDate: {
    type: Date,
    default: Date.now
  },
  condition: {
    type: String,
    enum: ['good', 'minor_damage', 'major_damage'],
    default: 'good'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

module.exports = mongoose.model('Return', returnSchema, 'returns');
