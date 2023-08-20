import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"
const AdminsRoles = new mongoose.Schema({
  RoleName: {
    type: String,
    required: true,
  },
  Permissions: {
    type: [String],
    required: true,
  },
});

AdminsRoles.plugin(softDelete)
const AdminRoleModel = mongoose.model("Roles", AdminsRoles);
export default AdminRoleModel;
