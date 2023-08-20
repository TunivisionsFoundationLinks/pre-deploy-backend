import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Set the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// Initialize multer
export const upload = multer({ storage });
// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }

    // Resize the image to the desired dimensions
    const resizedImage = await sharp(req.file.buffer)
      .resize({ width: 800, height: 800 }) // Set your desired width and height
      .toBuffer();
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});
router.post("/many", upload.any(), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No files uploaded");
    }
    const resizedImages = await Promise.all(
      req.files.map(async (file) => {
        const resizedImage = await sharp(file.buffer)
          .resize({ width: 800, height: 800 })
          .toBuffer();
        return resizedImage;
      })
    );

    // At this point, `resizedImages` contains an array of resized images
    // You can save, send, or process these images as needed
    return res.status(200).json({ message: "Files uploaded and resized" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading files" });
  }
});

router.get("/", (req, res) => {
  try {
    return res.sned(res);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
router.get("/many", upload.array("file"), (req, res) => {
  try {
    return res.render(res);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/dossier-download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../public/images/", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error downloading dossier" });
    }
  });
});

export default router;
