const mongoose = require('mongoose');

const ventSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  ipHash: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  reactions: {
    validations: {
      type: Number,
      default: 0
    },
    assholes: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one vent per IP per day
ventSchema.index({ ipHash: 1, createdAt: 1 }, { 
  unique: true,
  partialFilterExpression: {
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
  }
});

// Method to check if user can post today
ventSchema.statics.canPostToday = function(ipHash) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOne({
    ipHash,
    createdAt: { $gte: today }
  }).then(existingVent => !existingVent);
};

// Method to get today's vent for an IP
ventSchema.statics.getTodayVent = function(ipHash) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOne({
    ipHash,
    createdAt: { $gte: today }
  });
};

module.exports = mongoose.model('Vent', ventSchema);
