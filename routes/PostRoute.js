import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
} from "../controllers/PostController.js";
import { upload } from "../utils/upload.js";
const router = express.Router();

router.post("/", upload.any(), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/:id/timeline", getTimelinePosts);

export default router;
