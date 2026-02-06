import express from "express";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/checkRole.js";

import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/authController.js";

import {
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", auth, logout);
router.get("/profile", auth, getProfile);

router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.delete("/:id", auth, admin, deleteUser);

export default router;
