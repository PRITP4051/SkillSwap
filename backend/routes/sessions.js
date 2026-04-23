const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const Session = require('../models/Session');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { uploadQR, uploadScreenshot } = require('../middleware/upload');

dayjs.extend(utc);
dayjs.extend(timezone);

// ── IST auto-flow helper ──────────────────────────────────────────────────────
// Called on every "fetch sessions" to auto-advance confirmed → pending_completion
async function checkAndUpdatePendingCompletion(sessions) {
  const nowIST = dayjs().tz('Asia/Kolkata');

  const updates = sessions
    .filter((s) => {
      if (s.status !== 'confirmed') return false;
      // session end time = session.date + duration minutes
      const sessionEnd = dayjs(s.date).tz('Asia/Kolkata').add(s.duration || 60, 'minute');
      return nowIST.isAfter(sessionEnd);
    })
    .map((s) =>
      Session.findByIdAndUpdate(s._id, { status: 'pending_completion' }, { new: true })
    );

  if (updates.length > 0) {
    await Promise.all(updates);
  }
}

// ─── POST /api/sessions/book ─────────────────────────────────────────────────
// Learner books a session with a teacher
router.post('/book', auth, async (req, res) => {
  try {
    const { teacherId, skill, date, timeSlot, duration, price, notes } = req.body;

    if (!teacherId || !skill || !date || !price) {
      return res.status(400).json({ success: false, message: 'teacherId, skill, date and price are required' });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || !teacher.isActive) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    if (teacherId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot book a session with yourself' });
    }

    const sessionDate = new Date(date);
    const duplicateSession = await Session.findOne({
      teacher: teacherId,
      date: sessionDate,
      timeSlot: timeSlot || '',
      status: { $in: ['pending', 'confirmed', 'completed'] },
    });

    if (duplicateSession) {
      return res.status(400).json({
        success: false,
        message: 'This teacher is already booked for the selected date and time slot',
      });
    }

    // Auto-generate unique roomId
    const roomId = `${teacherId}_${req.user.id}_${Date.now()}`;

    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      date: sessionDate,
      timeSlot: timeSlot || '',
      duration: duration || 60,
      price: Number(price),
      notes: notes || '',
      status: 'pending',
      roomId,
    });

    const populated = await Session.findById(session._id)
      .populate('teacher', 'name avatar email')
      .populate('learner', 'name avatar email');

    return res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error('Book session error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/sessions/my ────────────────────────────────────────────────────
// All sessions where logged-in user is teacher OR learner
// Also auto-advances confirmed → pending_completion on-the-fly
router.get('/my', auth, async (req, res) => {
  try {
    let sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }],
    })
      .populate('teacher', 'name avatar email')
      .populate('learner', 'name avatar email')
      .sort({ createdAt: -1 });

    // Auto-advance confirmed sessions whose time has passed to pending_completion
    await checkAndUpdatePendingCompletion(sessions);

    // Re-fetch so updated statuses are returned
    sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }],
    })
      .populate('teacher', 'name avatar email')
      .populate('learner', 'name avatar email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    console.error('Get my sessions error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/sessions/:sessionId/status ────────────────────────────────────
// Teacher accepts (with paymentQR) / rejects pending sessions
// Teacher marks pending_completion sessions as completed or cancelled
router.put('/:sessionId/status', auth, uploadQR, async (req, res) => {
  try {
    const { status, meetingLink, contactNumber } = req.body;

    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (req.user.id !== session.teacher.toString()) {
      return res.status(403).json({ success: false, message: 'Only the teacher can update this session status' });
    }

    // ── Accepting a pending session ──────────────────────────────────────────
    if (session.status === 'pending') {
      const validStatuses = ['confirmed', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(', ')}` });
      }

      if (status === 'confirmed') {
        if (!String(meetingLink || '').trim() || !String(contactNumber || '').trim()) {
          return res.status(400).json({
            success: false,
            message: 'Meeting link and contact number are required to confirm a session',
          });
        }
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'Payment QR image is required to confirm a session' });
        }

        session.meetingLink = String(meetingLink).trim();
        session.contactNumber = String(contactNumber).trim();
        session.paymentQR = `/uploads/${req.file.filename}`; // Local URL
      }

      session.status = status;
    }
    // ── Completing or cancelling a pending_completion session ─────────────────
    else if (session.status === 'pending_completion') {
      const validStatuses = ['completed', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `status must be one of: ${validStatuses.join(', ')} for a pending_completion session`,
        });
      }
      session.status = status;
    } else {
      return res.status(400).json({
        success: false,
        message: `Cannot update status for a session in '${session.status}' state`,
      });
    }

    await session.save();

    const populated = await Session.findById(session._id)
      .populate('teacher', 'name avatar email')
      .populate('learner', 'name avatar email');

    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    console.error('Update session status error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/sessions/:sessionId/payment ───────────────────────────────────
// Learner uploads payment screenshot
router.post('/:sessionId/payment', auth, uploadScreenshot, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (req.user.id !== session.learner.toString()) {
      return res.status(403).json({ success: false, message: 'Only the learner can submit payment' });
    }

    if (session.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Payment can only be submitted for confirmed sessions' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
    }

    session.paymentScreenshot = `/uploads/${req.file.filename}`;
    session.paymentStatus = 'submitted';
    await session.save();

    const populated = await Session.findById(session._id)
      .populate('teacher', 'name avatar email')
      .populate('learner', 'name avatar email');

    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    console.error('Submit payment error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/sessions/:sessionId/verify-payment ────────────────────────────
// Teacher verifies or rejects learner's payment screenshot
router.put('/:sessionId/verify-payment', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'

    if (!action || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "action must be 'accept' or 'reject'" });
    }

    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (req.user.id !== session.teacher.toString()) {
      return res.status(403).json({ success: false, message: 'Only the teacher can verify payment' });
    }

    if (session.paymentStatus !== 'submitted') {
      return res.status(400).json({ success: false, message: 'No payment submission to verify' });
    }

    if (action === 'accept') {
      session.paymentStatus = 'verified';
    } else {
      session.paymentStatus = 'pending';
      session.paymentScreenshot = '';
    }

    await session.save();

    const populated = await Session.findById(session._id)
      .populate('teacher', 'name avatar email')
      .populate('learner', 'name avatar email');

    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/sessions/:sessionId ───────────────────────────────────────────
// Single session details (participants only)
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('teacher', 'name avatar email bio')
      .populate('learner', 'name avatar email');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const userId = req.user.id;
    const isParticipant =
      session.teacher._id.toString() === userId ||
      session.learner._id.toString() === userId ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this session' });
    }

    return res.status(200).json({ success: true, data: session });
  } catch (err) {
    console.error('Get session error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
