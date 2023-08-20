import express from "express";
import {
  loginUser,
  registerUser,
  registerUserAdmin,
  loginUserAdmin,
  sendEmails,
  ForgotPassword,
  ResetPassword,
  logoutUser,
} from "../controllers/AuthController.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "coverPicture", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  registerUser
);
router.post("/registerAdmin", registerUserAdmin);
router.post("/sendMail", sendEmails);
router.post("/forget-password", ForgotPassword);
router.post("/reset-password/:id/:ac_token", ResetPassword);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/loginAdmin", loginUserAdmin);

export default router;
