import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";

export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, name, email } = req.body;
    const user = req.user;

    const cin = new Date(checkIn);
    const cout = new Date(checkOut);

    if (isNaN(cin) || isNaN(cout) || cout <= cin) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const conflict = await Booking.findOne({
      roomId,
      $or: [{ checkIn: { $lt: cout }, checkOut: { $gt: cin } }],
    });

    if (conflict) {
      return res.status(409).json({ message: "Room already booked" });
    }

    const booking = await Booking.create({
      userId: user._id,
      roomId,
      name: name || user.name || "Guest",
      email: email || user.email || "guest@example.com",
      checkIn: cin,
      checkOut: cout,
    });

    const populated = await Booking.findById(booking._id).populate(
      "roomId",
      "name price number status",
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("roomId", "name price number status")
      .sort({ checkIn: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to get your bookings" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("roomId", "name price number status")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all bookings" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { confirmed: true },
      { new: true },
    ).populate("roomId", "name price number status");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const deleteMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
      confirmed: false,
    });

    if (!booking) {
      return res.status(400).json({ message: "Cannot delete this booking" });
    }

    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
