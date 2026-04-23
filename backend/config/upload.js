const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists at startup
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_TYPES = /jpeg|jpg|png|webp/;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ── Disk storage ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

// ── File filter ───────────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const extOk = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED_TYPES.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, webp images are allowed'), false);
  }
};

// ── Single shared multer instance ────────────────────────────────────────────
const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE_BYTES } });

module.exports = { upload };
