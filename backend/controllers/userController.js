const User = require('../models/User');

const normalizeSkillField = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map((skill) => String(skill).trim()).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, skillsTeach, skillsLearn, hourlyRate, availability } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Name should not be empty' });
    }

    if (hourlyRate !== undefined) {
      const parsedHourlyRate = Number(hourlyRate);

      if (Number.isNaN(parsedHourlyRate)) {
        return res.status(400).json({ success: false, message: 'Hourly rate must be a number' });
      }
    }

    const updateData = {};

    if (name !== undefined) updateData.name = String(name).trim();
    if (bio !== undefined) updateData.bio = bio;
    if (availability !== undefined) updateData.availability = availability;
    if (hourlyRate !== undefined) updateData.hourlyRate = Number(hourlyRate);

    const normalizedSkillsTeach = normalizeSkillField(skillsTeach);
    const normalizedSkillsLearn = normalizeSkillField(skillsLearn);

    if (normalizedSkillsTeach !== undefined) updateData.skillsTeach = normalizedSkillsTeach;
    if (normalizedSkillsLearn !== undefined) updateData.skillsLearn = normalizedSkillsLearn;

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { updateProfile };
