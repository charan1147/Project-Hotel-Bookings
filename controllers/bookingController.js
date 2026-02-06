import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { generateDateRange } from "../config/dateConfig.js";


const hasDateConflict = (existingBookings, requestedRange) =>
  existingBookings.some((b) =>
    generateDateRange(b.checkInDate, b.checkOutDate).some((d) =>
      requestedRange.includes(d),
    ),
  );


export const createBookingRoom = async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  const room = await Room.findById(roomId);
  if (!room)
    return res.status(404).json({ success: false, message: "Room not found" });

  const requestedRange = generateDateRange(checkInDate, checkOutDate);
  const bookings = await Booking.find({ roomId });

  if (hasDateConflict(bookings, requestedRange)) {
    return res.status(409).json({
      success: false,
      message: `Room is unavailable from ${checkInDate} to ${checkOutDate}`,
    });
  }

  const booking = await Booking.create(req.body);

  room.unavailableDates.push(...requestedRange);
  await room.save();

  res.status(201).json({
    success: true,
    data: booking,
    message: "Booking successfully created",
  });
};


export const getBookings = async (req, res) => {
  const bookings = await Booking.find().populate(
    "roomId",
    "name price unavailableDates",
  );
  res.json({ success: true, data: bookings });
};


export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ email: req.user.email }).populate(
    "roomId",
    "name price unavailableDates",
  );
  res.json({ success: true, data: bookings });
};


export const getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    "roomId",
    "name price unavailableDates",
  );

  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  res.json({ success: true, data: booking });
};


export const updateBooking = async (req, res) => {
  const { checkInDate, checkOutDate } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  const room = await Room.findById(booking.roomId);
  if (!room)
    return res.status(404).json({ success: false, message: "Room not found" });

  const requestedRange = generateDateRange(checkInDate, checkOutDate);

  const otherBookings = await Booking.find({
    roomId: booking.roomId,
    _id: { $ne: booking._id },
  });

  if (hasDateConflict(otherBookings, requestedRange)) {
    return res.status(409).json({
      success: false,
      message: `Room is unavailable from ${checkInDate} to ${checkOutDate}`,
    });
  }

  const oldRange = generateDateRange(booking.checkInDate, booking.checkOutDate);
  room.unavailableDates = room.unavailableDates.filter(
    (d) => !oldRange.includes(d),
  );

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  room.unavailableDates.push(...requestedRange);
  await room.save();

  res.json({ success: true, data: updatedBooking });
};


export const deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  const room = await Room.findById(booking.roomId);
  if (room) {
    const range = generateDateRange(booking.checkInDate, booking.checkOutDate);
    room.unavailableDates = room.unavailableDates.filter(
      (d) => !range.includes(d),
    );
    await room.save();
  }

  await booking.deleteOne();
  res.json({ success: true, message: "Booking deleted successfully" });
};


export const confirmBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { confirmed: true },
    { new: true },
  );

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json({ message: "Booking confirmed!", booking });
};


export const cancelBooking = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json({ message: "Booking canceled successfully" });
};
