const { upload } = require('../config/upload');

// Single avatar upload
const uploadAvatar = upload.single('avatar');

// Payment QR (teacher uploads when accepting)
const uploadQR = upload.single('paymentQR');

// Payment screenshot (learner uploads as proof)
const uploadScreenshot = upload.single('paymentScreenshot');

module.exports = { uploadAvatar, uploadQR, uploadScreenshot };
