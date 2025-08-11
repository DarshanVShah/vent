const express = require('express');
const router = express.Router();
const Vent = require('../models/Vent');
const { hashIP, getClientIP } = require('../utils/ipHash');

// Get all vents (for feed)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const vents = await Vent.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipHash'); // Don't expose IP hashes

    const total = await Vent.countDocuments({ isActive: true });

    res.json({
      vents,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching vents:', error);
    res.status(500).json({ error: 'Failed to fetch vents' });
  }
});

// Check if user can post today
router.get('/can-post', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const ipHash = hashIP(clientIP);
    
    const canPost = await Vent.canPostToday(ipHash);
    
    res.json({ canPost });
  } catch (error) {
    console.error('Error checking post eligibility:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

// Get user's vent for today
router.get('/today', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const ipHash = hashIP(clientIP);
    
    const vent = await Vent.getTodayVent(ipHash);
    
    if (!vent) {
      return res.json({ vent: null });
    }
    
    // Don't expose IP hash
    const { ipHash: _, ...ventData } = vent.toObject();
    res.json({ vent: ventData });
  } catch (error) {
    console.error('Error fetching today\'s vent:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s vent' });
  }
});

// Create a new vent
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Vent content is required' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ error: 'Vent content is too long (max 1000 characters)' });
    }
    
    const clientIP = getClientIP(req);
    const ipHash = hashIP(clientIP);
    
    // Check if user already posted today
    const canPost = await Vent.canPostToday(ipHash);
    if (!canPost) {
      return res.status(429).json({ error: 'You can only post one vent per day' });
    }
    
    const vent = new Vent({
      content: content.trim(),
      ipHash
    });
    
    await vent.save();
    
    // Don't expose IP hash in response
    const { ipHash: _, ...ventData } = vent.toObject();
    res.status(201).json({ vent: ventData });
  } catch (error) {
    console.error('Error creating vent:', error);
    
    if (error.code === 11000) {
      return res.status(429).json({ error: 'You can only post one vent per day' });
    }
    
    res.status(500).json({ error: 'Failed to create vent' });
  }
});

// Get a specific vent by ID
router.get('/:id', async (req, res) => {
  try {
    const vent = await Vent.findById(req.params.id).select('-ipHash');
    
    if (!vent) {
      return res.status(404).json({ error: 'Vent not found' });
    }
    
    res.json({ vent });
  } catch (error) {
    console.error('Error fetching vent:', error);
    res.status(500).json({ error: 'Failed to fetch vent' });
  }
});

module.exports = router;
