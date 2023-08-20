import express from "express";
import {
  CreateActivity,
  getAllActivitys,
  getActivity,
  participation,
  unparticipation,
  verified,
  sendRecu,
  acceptedEvent,
  RefusedEvent,
} from "../controllers/ActivityController.js";
import { upload } from "../utils/upload.js";
const router = express.Router();
router.post(
  "/",
  upload.fields([
    { name: "activityCover", maxCount: 1 },
    { name: "DossierSponsing", maxCount: 1 },
  ]),
  CreateActivity
);
router.get("/all", getAllActivitys); // done
router.get("/:id", getActivity); //done
router.put("/:id", participation); //  working now
router.put("/:id/unpar", unparticipation); //  working now
router.put("/:id/recu", upload.single("recu"), sendRecu); // waiting
router.put("/:id/verify", verified); // waiting
router.put("/:id/refuse", RefusedEvent); // done but have some problems
router.put("/:id/accepted", acceptedEvent); // done but have some problems

export default router;
