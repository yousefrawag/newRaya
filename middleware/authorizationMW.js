module.exports = (permission) => {
  return async (req, res, next) => {
    let userPremissions = [];
    console.log("form authorization", req.token.role);
    if (req.token.role) {
      userPremissions = req.token.role.permissions;
    }
    const hasPermission = userPremissions.some((p) => p === permission);

    if (req.token.type === "admin" || hasPermission) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };
};
