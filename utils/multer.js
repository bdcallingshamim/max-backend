const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Set up the upload directory
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Upload directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});

// File filter to allow only JPG/JPEG formats
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only JPG or JPEG files are allowed!'), false); // Reject file
  }
};

// Multer setup with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware to resize images after upload
const resizeImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(); // No files to resize
  }

  try {
    // Process each file in req.files
    await Promise.all(
      req.files.map(async (file) => {
        const originalFilePath = path.join(uploadDir, file.filename);

        // Paths for the resized images
        const thumbFilePath = path.join(uploadDir, `thumb-${file.filename}`);
        const displayFilePath = path.join(uploadDir, `display-${file.filename}`);

        // Generate the thumbnail (70x70)
        await sharp(originalFilePath)
          .resize(70, 70, { fit: 'cover' })
          .toFile(thumbFilePath);

        // Generate the larger display image (693x482)
        await sharp(originalFilePath)
          .resize(693, 482, { fit: 'cover' })
          .toFile(displayFilePath);

        // Remove the original file
        fs.unlinkSync(originalFilePath);

        // Update file paths in req.files to only include the resized versions
        file.thumbnails = {
          thumb: thumbFilePath,
          display: displayFilePath,
        };
      })
    );

    next();
  } catch (error) {
    console.error('Error resizing images:', error);
    return res.status(500).json({ status: 'failed', message: 'Failed to resize images' });
  }
};

module.exports = { upload, resizeImages };
