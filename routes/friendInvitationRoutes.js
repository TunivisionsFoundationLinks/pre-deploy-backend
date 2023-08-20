import  express from "express";
const router = express.Router();

import { inviteFriend, acceptInvitation, rejectInvitation, removeFriend } from "../controllers/friendInvitation.controller.js";

import  Joi from "joi";
import  validators from "express-joi-validation";
import authMiddleWare from "../middleware/AuthMiddleware.js";
const validator = validators.createValidator({});
const invitationSchema = Joi.object({
    email: Joi.string().email().required(),
});


const approveInvitationSchema = Joi.object({
    invitationId: Joi.string().required(),
});

const removeFriendSchema = Joi.object({
    friendId: Joi.string().required(),
});


// invite a friend
router.post("/invite", authMiddleWare, validator.body(invitationSchema), inviteFriend);

// accept a friend invitation
router.post("/accept", authMiddleWare, validator.body(approveInvitationSchema), acceptInvitation);

// reject a friend invitation
router.post("/reject", authMiddleWare, validator.body(approveInvitationSchema), rejectInvitation);

// remove a friend
router.post("/remove", authMiddleWare, validator.body(removeFriendSchema), removeFriend);

export default router;
