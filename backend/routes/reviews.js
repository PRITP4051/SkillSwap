const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Session = require('../models/Session');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ─── POST /api/reviews ───────────────────────────────────────────────────────
// Submit a review for a completed session (learner only, payment must be verified)
router.post('/', auth, async (req, res) => {
  try {
    const { sessionId, revieweeId, rating, comment } = req.body;

    if (!sessionId || !revieweeId || !rating) {
      return res.status(400).json({ success: false, message: 'sessionId, revieweeId and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed sessions' });
    }

    // Payment must be verified before a review can be submitted
    if (session.paymentStatus !== 'verified') {
      return res.status(400).json({ success: false, message: 'Payment must be verified before submitting a review' });
    }

    const userId = req.user.id;

    if (session.learner.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only the learner can review this session' });
    }

    if (session.teacher.toString() !== revieweeId) {
      return res.status(400).json({ success: false, message: 'Invalid reviewee for this session' });
    }

    // Prevent duplicate review
    const existing = await Review.findOne({ session: sessionId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A review already exists for this session' });
    }

    const review = await Review.create({
      session: sessionId,
      reviewer: userId,
      reviewee: revieweeId,
      rating: Number(rating),
      comment: comment || '',
    });

    // Recalculate reviewee's average rating and totalReviews
    const reviews = await Review.find({ reviewee: revieweeId });
    const count = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / count;

    await User.findByIdAndUpdate(revieweeId, {
      $set: { rating: avg, totalReviews: count },
    });

    const populated = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar');

    return res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error('Submit review error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/reviews/my ─────────────────────────────────────────────────────
router.get('/my', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .select('session reviewer reviewee rating comment createdAt');

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error('Get my reviews error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/reviews/user/:userId ───────────────────────────────────────────
// All reviews for a user (as reviewee)
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('session', 'skill date')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error('Get reviews error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
