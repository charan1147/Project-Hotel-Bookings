import express from "express";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/checkRole.js";
import {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", auth, getAllRooms);
router.get("/:id", auth, getRoomById);

router.post("/create", auth, admin, createRoom);
router.put("/:id", auth, admin, updateRoom);
router.delete("/:id", auth, admin, deleteRoom);

export default router;
