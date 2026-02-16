import jwt from "jsonwebtoken";

const generateToken = (user, expiresIn = "7d") =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn },
  );

export default generateToken;
