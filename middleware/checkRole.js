export const checkRole = (role) => (req, res, next) =>
  req.user.role === role
    ? next()
    : res.status(403).json({ message: "Forbidden" });
