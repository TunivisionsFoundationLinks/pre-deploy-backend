import AdminRoleModel from "../models/AdminRole.js";
import asyncHandler from "express-async-handler"
export const CreateRole = asyncHandler(async (req, res) => {
  try {
    const isRole = await AdminRoleModel.findOne({
      RoleName: req.body.RoleName,
    });
    if (isRole) {
      res.status(400).json({ msg: "Role already exists" });
    }
    const role = new AdminRoleModel(req.body);
    const roles = await role.save();
    res.status(200).json({ roles });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});
export const getAllRoles = asyncHandler(async (req, res) => {
  try {
    let Roles = await AdminRoleModel.find();
    Roles = Roles.map((Role) => {
      return Role;
    });
    res.status(200).json({ Roles });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});
export const getOneRole = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const role = await AdminRoleModel.findById(id);
    res.status(200).json({ role });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

export const UpdateRole = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Role = await AdminRoleModel.findByIdAndUpdate(id, req.body);
    const Permission = req.body.Permissions;
    if (Permission) {
      Role.Permissions.concat(Permission)
    }
    await Role.save();
    res.status(200).json({ Role });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
})
export const DeleteRole = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Role = await AdminRoleModel.findById(id, req.body);
    await Role.deleteOne();
    res.status(200).json({ Role });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
})