const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Session = require('../models/Session');
const User = require('../models/User');

/**
 * Initialise Socket.IO real-time chat.
 * @param {import('socket.io').Server} io
 */
const initSocket = (io) => {
  // ── Authentication middleware ──────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      if (!authToken) {
        return next(new Error('Authentication token required'));
      }

      const token = authToken.startsWith('Bearer ') ? authToken.slice(7) : authToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        return next(new Error('User not found or suspended'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.userName = user.name;
      socket.userAvatar = user.avatar;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} | User: ${socket.userName}`);

    // ── join_room ────────────────────────────────────────────────────────────
    socket.on('join_room', async ({ roomId }) => {
      try {
        if (!roomId) return;

        // Verify user is a participant of this room
        const session = await Session.findOne({ roomId });
        if (!session) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const isParticipant =
          session.teacher.toString() === socket.userId ||
          session.learner.toString() === socket.userId;

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to join this room' });
          return;
        }

        // Admins bypass payment gate; regular users need verified payment
        if (socket.userRole !== 'admin' && session.paymentStatus !== 'verified') {
          socket.emit('error', { message: 'Chat is only available after payment has been verified' });
          return;
        }

        socket.join(roomId);
        console.log(`${socket.userName} joined room: ${roomId}`);

        socket.emit('room_joined', { roomId });
      } catch (err) {
        console.error('join_room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ── send_message ─────────────────────────────────────────────────────────
    socket.on('send_message', async ({ roomId, content }) => {
      try {
        if (!roomId || !content || !content.trim()) {
          socket.emit('error', { message: 'roomId and content are required' });
          return;
        }

        // Verify user is a participant
        const session = await Session.findOne({ roomId });
        if (!session) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const isParticipant =
          session.teacher.toString() === socket.userId ||
          session.learner.toString() === socket.userId;

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to send messages in this room' });
          return;
        }

        // Enforce payment verified gate
        if (socket.userRole !== 'admin' && session.paymentStatus !== 'verified') {
          socket.emit('error', { message: 'Chat is only available after payment has been verified' });
          return;
        }

        // Save to MongoDB
        const savedMessage = await Message.create({
          roomId,
          sender: socket.userId,
          content: content.trim(),
        });

        const message = await Message.findById(savedMessage._id).populate('sender', 'name avatar');

        const payload = {
          _id: message._id,
          roomId: message.roomId,
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
          read: message.read,
        };

        // Emit to all users in the room (including sender)
        io.to(roomId).emit('receive_message', payload);
      } catch (err) {
        console.error('send_message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} | User: ${socket.userName} | Reason: ${reason}`);
    });
  });
};

module.exports = initSocket;
