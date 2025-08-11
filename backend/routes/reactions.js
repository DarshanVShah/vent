const express = require('express');
const router = express.Router();
const Reaction = require('../models/Reaction');
const Vent = require('../models/Vent');
const { hashIP, getClientIP } = require('../utils/ipHash');

// React to a vent (validation or asshole)
router.post('/:ventId', async (req, res) => {
  try {
    const { ventId } = req.params;
    const { reactionType } = req.body;
    
    if (!['validation', 'asshole'].includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }
    
    // Check if vent exists
    const vent = await Vent.findById(ventId);
    if (!vent) {
      return res.status(404).json({ error: 'Vent not found' });
    }
    
    const clientIP = getClientIP(req);
    const ipHash = hashIP(clientIP);
    
    // Check if user already reacted to this vent
    const existingReaction = await Reaction.findOne({
      ventId,
      ipHash
    });
    
    if (existingReaction) {
      // Update existing reaction
      existingReaction.reactionType = reactionType;
      await existingReaction.save();
    } else {
      // Create new reaction
      const reaction = new Reaction({
        ventId,
        ipHash,
        reactionType
      });
      await reaction.save();
    }
    
    // Update vent reaction counts
    const stats = await Reaction.getVentStats(ventId);
    const validations = stats.find(s => s._id === 'validation')?.count || 0;
    const assholes = stats.find(s => s._id === 'asshole')?.count || 0;
    
    await Vent.findByIdAndUpdate(ventId, {
      'reactions.validations': validations,
      'reactions.assholes': assholes
    });
    
    res.json({ 
      success: true, 
      reactions: { validations, assholes } 
    });
  } catch (error) {
    console.error('Error creating reaction:', error);
    res.status(500).json({ error: 'Failed to create reaction' });
  }
});

// Get reaction stats for a vent
router.get('/:ventId/stats', async (req, res) => {
  try {
    const { ventId } = req.params;
    
    const stats = await Reaction.getVentStats(ventId);
    const validations = stats.find(s => s._id === 'validation')?.count || 0;
    const assholes = stats.find(s => s._id === 'asshole')?.count || 0;
    
    res.json({
      validations,
      assholes
    });
  } catch (error) {
    console.error('Error fetching reaction stats:', error);
    res.status(500).json({ error: 'Failed to fetch reaction stats' });
  }
});

// Get user's reaction to a specific vent
router.get('/:ventId/user', async (req, res) => {
  try {
    const { ventId } = req.params;
    const clientIP = getClientIP(req);
    const ipHash = hashIP(clientIP);
    
    const reaction = await Reaction.findOne({ ventId, ipHash });
    
    res.json({ 
      reaction: reaction ? reaction.reactionType : null 
    });
  } catch (error) {
    console.error('Error fetching user reaction:', error);
    res.status(500).json({ error: 'Failed to fetch user reaction' });
  }
});

module.exports = router;
