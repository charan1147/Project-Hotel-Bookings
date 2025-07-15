import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const auth = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error: JWT_SECRET not set" });
        }
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "No authorization token provided" });
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);
        if (!data?.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        const user = await User.findById(data.id).select("-password").lean();
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};

export default auth;