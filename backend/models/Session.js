const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, default: '' },
    duration: { type: Number, default: 60 }, // minutes
    price: { type: Number, required: true },
    notes: { type: String, default: '' },
    meetingLink: { type: String, default: '' },
    contactNumber: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'pending_completion', 'completed', 'cancelled'],
      default: 'pending',
    },
    roomId: { type: String, required: true, unique: true },

    // ── Payment fields ──────────────────────────────────────────────────────
    paymentQR: { type: String, default: '' },          // Cloudinary URL of teacher's QR code
    paymentScreenshot: { type: String, default: '' },  // Cloudinary URL uploaded by learner
    paymentStatus: {
      type: String,
      enum: ['pending', 'submitted', 'verified'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

sessionSchema.index({ teacher: 1, learner: 1, status: 1 });
sessionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
