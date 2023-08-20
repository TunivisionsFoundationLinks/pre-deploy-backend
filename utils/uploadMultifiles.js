import multer from "multer";
import fs from "fs";
import path from "path";

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array("images")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    // Retrieve uploaded files
    const files = req.files;
    console.log(files);
    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};
export default uploadMiddleware;
