import express from "express";
import { CreateRole, DeleteRole, getAllRoles, getOneRole, UpdateRole } from "../controllers/AdminRoleController.js";

const router = express.Router();


router.get('/',getAllRoles);
router.post('/',CreateRole);
router.get('/:id',getOneRole);
router.patch('/:id',UpdateRole);
router.delete('/:id',DeleteRole);



export default router;