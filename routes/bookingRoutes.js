import express from "express";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/checkRole.js";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  confirmBooking,
  cancelBooking,
  deleteMyBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", auth, createBooking);
router.get("/my-bookings", auth, getMyBookings);
router.delete("/:id", auth, deleteMyBooking);

router.get("/", auth, admin, getAllBookings);
router.put("/confirm/:id", auth, admin, confirmBooking);
router.delete("/cancel/:id", auth, admin, cancelBooking);

export default router;
