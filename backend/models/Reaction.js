const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  ventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vent',
    required: true
  },
  ipHash: {
    type: String,
    required: true
  },
  reactionType: {
    type: String,
    enum: ['validation', 'asshole'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one reaction per IP per vent
reactionSchema.index({ ventId: 1, ipHash: 1 }, { unique: true });

// Method to get reaction stats for a vent
reactionSchema.statics.getVentStats = function(ventId) {
  return this.aggregate([
    { $match: { ventId: mongoose.Types.ObjectId(ventId) } },
    {
      $group: {
        _id: '$reactionType',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Reaction', reactionSchema);
