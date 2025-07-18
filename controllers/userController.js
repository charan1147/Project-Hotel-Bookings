import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../config/genrateToken.js";

// ✅ Register
export const register = async (req, res, next) => {
  try {
    const { password, role, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...rest,
      password: hashedPassword,
      role: role || "user",
    });

    const token = generateToken(user);
    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Token generation failed" });
    }

    const { password: userPassword, ...userData } = user._doc;

    // ⛔ Removed res.cookie – now send token in body
    res.status(201).json({
      success: true,
      user: userData,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(400).json({ success: false, message: "Email already exists" });
  }
};

// ✅ Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);
    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Token generation failed" });
    }

    const { password: userPassword, ...userData } = user._doc;

    // ⛔ Removed res.cookie – now send token in body
    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    next(error);
  }
};

// ✅ Logout – just frontend localStorage cleanup now
export const logout = (req, res, next) => {
  try {
    // No cookie to clear – logout is handled client-side
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    next(error);
  }
};

// ✅ Get All Users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error in getUsers controller:", error.message);
    next(error);
  }
};

// ✅ Get Single User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in getUser controller:", error.message);
    next(error);
  }
};

// ✅ Profile
export const profile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error("Error in profile controller:", error.message);
    next(error);
  }
};

// ✅ Delete Account
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    // No cookie to clear anymore
    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser controller:", error.message);
    next(error);
  }
};
