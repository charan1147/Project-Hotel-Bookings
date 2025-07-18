import jwt from "jsonwebtoken";

const generateToken = (user, expiresIn = "7d") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Server configuration error: JWT_SECRET missing");
  }

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error generating token:", error.message);
    }
    throw new Error("Token generation failed");
  }
};

export default generateToken;
