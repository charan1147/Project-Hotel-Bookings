import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";

export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, name, email } = req.body;
    const user = req.user;

    const cin = new Date(checkIn);
    const cout = new Date(checkOut);

    if (isNaN(cin.getTime()) || isNaN(cout.getTime()) || cout <= cin) {
      return res.status(400).json({
        message: "Invalid date range — check-out must be after check-in",
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.status === "maintenance") {
      return res
        .status(400)
        .json({ message: "This room is under maintenance" });
    }

    const conflict = await Booking.findOne({
      roomId,
      $or: [{ checkIn: { $lt: cout }, checkOut: { $gt: cin } }],
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Room is already booked for the selected dates" });
    }

    const booking = await Booking.create({
      userId: user._id,
      roomId,
      name: name || user.name || "Guest User",
      email: email || user.email || "guest@example.com",
      checkIn: cin,
      checkOut: cout,
    });

    const populated = await Booking.findById(booking._id).populate(
      "roomId",
      "name price number status",
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error while creating booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("roomId", "name price number status")
      .sort({ checkIn: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your bookings" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("roomId", "name price number status")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { confirmed: true },
      { new: true, runValidators: true },
    ).populate("roomId", "name price number status");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking cancelled and removed" });
  } catch (err) {
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
      return res.status(400).json({
        message:
          "Booking not found, does not belong to you, or is already confirmed",
      });
    }

    res.json({ message: "Your booking was deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
