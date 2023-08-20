const RoleControleAccess = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req?.roles.Permissions) return res.sendStatus(401);
    const rolesArray = [...allowedRoles.permissions];
    console.log(rolesArray);
    console.log(req.roles.Permissions);
    const result = req.roles.Permissions.map((permission) =>
      rolesArray.includes(permission)
    ).find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};

export default RoleControleAccess;