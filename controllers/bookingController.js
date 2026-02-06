import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { generateDateRange } from "../config/dateRange.js";

const datesOverlap = (existing, requested) =>
  existing.some((d) => requested.includes(d));

export const createBooking = async (req, res) => {
  const { roomId, checkInDate, checkOutDate, name, email } = req.body;

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  const requestedDates = generateDateRange(checkInDate, checkOutDate);

  const conflicting = await Booking.find({
    roomId,
    $or: [
      {
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate },
      },
    ],
  });

  if (
    datesOverlap(
      conflicting
        .map((b) => generateDateRange(b.checkInDate, b.checkOutDate))
        .flat(),
      requestedDates,
    )
  ) {
    return res
      .status(409)
      .json({ message: "Room not available in selected dates" });
  }

  const booking = await Booking.create({
    roomId,
    userId: req.user._id,
    name: name || req.user.name,
    email: email || req.user.email,
    checkInDate,
    checkOutDate,
  });

  res.status(201).json(booking);
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate(
    "roomId",
    "name price number",
  );
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
  ).populate("roomId");
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
  if (!booking)
    return res
      .status(404)
      .json({ message: "Booking not found or already confirmed" });
  res.json({ message: "Booking deleted" });
};
