const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// All admin routes require auth + admin role
router.use(auth, admin);

// ─── GET /api/admin/stats ────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalSessions, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments(),
      Session.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    return res.status(200).json({
      success: true,
      data: { totalUsers, totalSessions, totalRevenue },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/users ────────────────────────────────────────────────────
// All users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('Admin get users error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/users/:userId/suspend ────────────────────────────────────
// Toggle isActive for a user
router.put('/users/:userId/suspend', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      data: { user, message: user.isActive ? 'User activated' : 'User suspended' },
    });
  } catch (err) {
    console.error('Admin suspend user error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/users/:userId ────────────────────────────────────────
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (err) {
    console.error('Admin delete user error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/sessions ─────────────────────────────────────────────────
router.get('/sessions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      Session.find()
        .populate('teacher', 'name email avatar')
        .populate('learner', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Session.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('Admin get sessions error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
