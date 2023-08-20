import  express from "express";
import  Joi from "joi";
import  validators from "express-joi-validation";
import authMiddleWare from "../middleware/AuthMiddleware.js";
const validator = validators.createValidator({});
const router = express.Router();

import {
    createGroupChat,
    addMemberToGroup,
    leaveGroup,
    deleteGroup
} from "../controllers/groupChat.controller.js";



const createGroupChatSchema = Joi.object({
    name: Joi.string().required(),
});

const addMemberSchema = Joi.object({
    friendIds: Joi.array().min(1).items(Joi.string()),
    groupChatId: Joi.string().required(),
});

const leaveGroupSchema = Joi.object({
    groupChatId: Joi.string().required(),
});

const deleteGroupSchema = Joi.object({
    groupChatId: Joi.string().required(),
});

// create a groupChat
router.post(
    "/",
    authMiddleWare,
    validator.body(createGroupChatSchema),
    createGroupChat
);

// add a friend to the group
router.post(
    "/add",
    authMiddleWare,
    validator.body(addMemberSchema),
    addMemberToGroup
);

// leave a group
router.post(
    "/leave",
    authMiddleWare,
    validator.body(leaveGroupSchema),
    leaveGroup
);

// delete a group
router.post(
    "/delete",
    authMiddleWare,
    validator.body(deleteGroupSchema),
    deleteGroup
);


export default router;
