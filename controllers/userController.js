import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../config/genrateToken.js";

export const register = async (req, res) => {
  const { password, role = "user", ...data } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    ...data,
    password: hashedPassword,
    role,
  });

  const token = generateToken(user);
  const { password: _, ...userData } = user._doc;

  res.status(201).json({
    success: true,
    user: userData,
    token,
    message: "User created successfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user);
  const { password: _, ...userData } = user._doc;

  res.json({
    success: true,
    user: userData,
    token,
    message: "Login successful",
  });
};

export const logout = (req, res) => {
  res.json({ success: true, message: "Logout successful" });
};

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, data: user });
};

export const profile = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ success: true, message: "Account deleted successfully" });
};
