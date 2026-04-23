const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ─── GET /api/skills/search?q= ────────────────────────────────────────────────
// Search all unique skills from User.skillsTeach field and return matching teachers
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }

    // Find active users whose skillsTeach match the query
    const teachers = await User.find({
      isActive: true,
      skillsTeach: { $regex: q, $options: 'i' },
    }).select('name avatar skillsTeach hourlyRate rating totalReviews bio');

    // Also collect all unique matching skills
    const skillSet = new Set();
    teachers.forEach((teacher) => {
      teacher.skillsTeach.forEach((skill) => {
        if (skill.toLowerCase().includes(q.toLowerCase())) {
          skillSet.add(skill);
        }
      });
    });

    return res.status(200).json({
      success: true,
      data: {
        skills: Array.from(skillSet).sort(),
        teachers,
      },
    });
  } catch (err) {
    console.error('Skill search error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
