const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  itemSnapshot: {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: [
      'pending',
      'approved',
      'rejected',
      'borrowed',
      'returned',
      'overdue'
    ],
    default: 'pending'
  },
  dueDate: {
    type: Date
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

module.exports = mongoose.model('Loan', loanSchema, 'loans');
