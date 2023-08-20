import express from "express";
import {
  addBureau,
  addTunimateurs,
  CreateClub,
  DeleteClub,
  getAllClubs,
  getClub,
  RequestesJoinIn,
  UpdateBureau,
  UpdateClub,
  UpdateTunimateurs,
} from "../controllers/ClubsControllers.js";
const router = express.Router();

router.post("/", CreateClub); // integration done
router.get("/", getAllClubs); // integration done
router.get("/:id", getClub); // integration done
router.patch("/:id", UpdateClub); // later
router.delete("/:id", DeleteClub); // later
router.put("/:id/addTunimateur", addTunimateurs); // integration done
router.put("/:id/addBureau", addBureau); // integration done
router.put("/:id/updateTunimateur", UpdateTunimateurs); // later
router.put("/:id/updateBureau", UpdateBureau); // later
router.put("/:id/reqjoin", RequestesJoinIn); // integration done

export default router;
