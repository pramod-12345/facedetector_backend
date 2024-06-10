const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Ensure the 'video' directory exists
const videoDir = path.join(__dirname, 'video');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir);
}

// Set up multer for storing uploaded videos in the 'video' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'video');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|avi|mkv|mov|quicktime/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File upload only supports the following filetypes - ' + filetypes));
  }
}).single('video');

// Endpoint to upload video
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    res.send({ message: 'Video uploaded successfully', file: req.file });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
