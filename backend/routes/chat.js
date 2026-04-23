const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

// ── Helper: check if user is a verified participant of a session ─────────────
function isVerifiedParticipant(session, userId, userRole) {
  const isParticipant =
    session.teacher.toString() === userId ||
    session.learner.toString() === userId ||
    userRole === 'admin';

  if (!isParticipant) return { allowed: false, reason: 'Not authorized to access this chat' };

  // Admins bypass payment gate
  if (userRole === 'admin') return { allowed: true };

  // Chat is only enabled when payment is verified
  if (session.paymentStatus !== 'verified') {
    return { allowed: false, reason: 'Chat is only available after payment has been verified' };
  }

  return { allowed: true };
}

// ─── GET /api/chat/conversations ─────────────────────────────────────────────
// List all distinct rooms for the logged-in user, grouped by roomId
router.get('/conversations', auth, async (req, res) => {
  try {
    // Find sessions where user is teacher or learner to get their roomIds
    const sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }],
    })
      .populate('teacher', 'name avatar')
      .populate('learner', 'name avatar')
      .select('roomId teacher learner skill status paymentStatus')
      .sort({ createdAt: -1 });

    // For each session, attach last message
    const conversations = await Promise.all(
      sessions.map(async (session) => {
        const lastMessage = await Message.findOne({ roomId: session.roomId })
          .sort({ timestamp: -1 })
          .select('content timestamp sender read');

        const unreadCount = await Message.countDocuments({
          roomId: session.roomId,
          read: false,
          sender: { $ne: req.user.id },
        });

        return {
          roomId: session.roomId,
          session: {
            _id: session._id,
            skill: session.skill,
            status: session.status,
            paymentStatus: session.paymentStatus,
          },
          teacher: session.teacher,
          learner: session.learner,
          lastMessage,
          unreadCount,
          chatEnabled: session.paymentStatus === 'verified',
        };
      })
    );

    return res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/chat/messages/:roomId ──────────────────────────────────────────
// All messages in a room (payment must be verified)
router.get('/messages/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    // Verify user belongs to this room
    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const { allowed, reason } = isVerifiedParticipant(session, req.user.id, req.user.role);
    if (!allowed) {
      return res.status(403).json({ success: false, message: reason });
    }

    const messages = await Message.find({ roomId })
      .populate('sender', 'name avatar')
      .sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      { roomId, sender: { $ne: req.user.id }, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error('Get messages error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/chat/messages ──────────────────────────────────────────────────
// Save a message (REST fallback alongside Socket.IO) — payment must be verified
router.post('/messages', auth, async (req, res) => {
  try {
    const { roomId, content } = req.body;

    if (!roomId || !content) {
      return res.status(400).json({ success: false, message: 'roomId and content are required' });
    }

    // Verify user is a participant of this room
    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const { allowed, reason } = isVerifiedParticipant(session, req.user.id, req.user.role);
    if (!allowed) {
      return res.status(403).json({ success: false, message: reason });
    }

    const message = await Message.create({
      roomId,
      sender: req.user.id,
      content,
    });

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');

    return res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error('Save message error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
