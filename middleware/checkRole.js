
export const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No authenticated user: authentication required" });
        }

        if (req.user.role === requiredRole) {
            return next();
        }

        return res.status(403).json({
            message: `Forbidden: access denied. Required role: ${requiredRole}, User role: ${req.user.role}`,
        });
    };
};