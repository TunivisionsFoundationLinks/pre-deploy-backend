import express from "express";
import {
  addMembresChapter,
  CreateChapter,
  DeleteChapter,
  getAllChapters,
  getChapter,
  RemouveMembresChapter,
  UpdateChapter,
  updateCoverImage,
  updateProfileImage,
} from "../controllers/ChapterController.js";
import { upload } from "../utils/upload.js";
const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  CreateChapter
);
router.get("/", getAllChapters);
router.get("/:id", getChapter);
router.patch("/:id", UpdateChapter);
router.delete("/:id", DeleteChapter);
router.put("/rmM/:id", RemouveMembresChapter);
router.put("/addM/", addMembresChapter);
router.put(
  "/updateProfileImage",
  upload.single("profileImage"),
  updateProfileImage
);
router.put("/updateCoverImage", upload.single("coverImage"), updateCoverImage);

export default router;
