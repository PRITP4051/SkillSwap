const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const { updateProfile } = require('../controllers/userController');

router.put('/profile', auth, uploadAvatar, updateProfile);

// List all teachers; supports ?skill= and ?minPrice= / ?maxPrice= filters
router.get('/teachers', async (req, res) => {
  try {
    const { skill, minPrice, maxPrice } = req.query;

    const query = { isActive: true, skillsTeach: { $exists: true, $not: { $size: 0 } } };

    if (skill) {
      query.skillsTeach = { $regex: skill, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.hourlyRate = {};
      if (minPrice !== undefined) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.hourlyRate.$lte = Number(maxPrice);
    }

    const teachers = await User.find(query).select('-password').sort({ rating: -1 });

    return res.status(200).json({ success: true, data: teachers });
  } catch (err) {
    console.error('Get teachers error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Public profile of any user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
