import express from "express";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/checkRole.js";
import {
  createRooms,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", auth, getRooms);
router.get("/:id", auth, getRoom);

router.post("/create", auth, admin, createRooms);
router.put("/:id", auth, admin, updateRoom);
router.delete("/:id", auth, admin, deleteRoom);

export default router;
