import express from "express"
import {getMyBookings, getBookings,getBooking,createBookingRoom,updateBooking, deleteBooking,confirmBooking,cancelBooking } from "../controllers/bookingController.js"
import auth from "../middleware/authMiddleware.js"
import { checkRole } from "../middleware/checkRole.js"
const router=express.Router()

router.get("/mybookings", auth, getMyBookings);
router.get('/', auth, checkRole('admin'), getBookings); 
router.get('/:id', auth, getBooking);
router.post('/create', auth, checkRole('user'), createBookingRoom); 
router.put('/:id', auth, checkRole('user'), updateBooking); 
router.delete('/:id', auth, checkRole('user'), deleteBooking); 
router.put("/confirm/:id", auth,checkRole('admin'), confirmBooking);
router.delete("/cancel/:id", auth,checkRole('admin'), cancelBooking);
export default router     