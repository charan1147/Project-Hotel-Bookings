import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../config/genrateToken.js"; 

export const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const user = await User.create({
      name,
      email,
      password, 
      role,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
};

export const logout = (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getProfile = (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};
