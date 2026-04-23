const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    skillsTeach: [{ type: String }],
    skillsLearn: [{ type: String }],
    hourlyRate: { type: Number, default: 500 },
    availability: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for skill search
userSchema.index({ skillsTeach: 'text' });

module.exports = mongoose.model('User', userSchema);
