import express from "express";
import { GetRegion } from "../controllers/StatesController.js";

const router = express.Router();


router.get("/", GetRegion);


export default router;