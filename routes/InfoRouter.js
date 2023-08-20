import express from "express";
import {
  getInfo,
  CreateInfo,
  updateInfo,
  deleteInfo,
  getInfoById,
} from "../controllers/infoController.js";
const router = express.Router();

router.get("/", getInfo);
router.get("/:id", getInfoById);
router.post("/", CreateInfo);
router.put("/:id", updateInfo);
router.delete("/:id", deleteInfo);

export default router;
