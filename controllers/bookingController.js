import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";

export const createBooking = async (req, res) => {
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
    return res
      .status(409)
      .json({ message: "Room already booked for these dates" });
  }

  const booking = await Booking.create({
    userId: user._id,
    roomId,
    name: name || user.name,
    email: email || user.email,
    checkIn: cin,
    checkOut: cout,
  });

  res.status(201).json(booking);
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("roomId", "name price number")
    .sort({ checkIn: -1 });
  res.json(bookings);
};

export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("roomId", "name price number")
    .populate("userId", "name email");
  res.json(bookings);
};

export const confirmBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { confirmed: true },
    { new: true },
  );
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json({ message: "Booking cancelled" });
};

export const deleteMyBooking = async (req, res) => {
  const booking = await Booking.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
    confirmed: false,
  });
  if (!booking) {
    return res
      .status(400)
      .json({ message: "Cannot delete — not yours or already confirmed" });
  }
  res.json({ message: "Booking deleted" });
};
