import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { generateDateRange } from "../config/dateConfig.js";

export const createBookingRoom = async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const existingBookings = await Booking.find({ roomId });
    const requestedRange = generateDateRange(checkInDate, checkOutDate);

    const isUnavailable = existingBookings.some((booking) => {
      const bookingRange = generateDateRange(booking.checkInDate, booking.checkOutDate);
      return requestedRange.some((date) => bookingRange.includes(date));
    });

    if (isUnavailable) {
      return res.status(409).json({
        success: false,
        message: `Room is unavailable from ${checkInDate} to ${checkOutDate}`,
      });
    }

    const booking = await Booking.create(req.body);

    room.unavailableDates = [...room.unavailableDates, ...requestedRange];
    await room.save();

    res.status(201).json({
      success: true,
      data: booking,
      message: "Booking successfully created",
    });
  } catch (error) {
    console.error("Error in createBookingRoom controller:", error.message);
    next(error);
  }
};
export const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate("roomId", "name price unavailableDates");
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error in getBookings controller:", error.message);
        next(error);
    }
};
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email }).populate(
      "roomId",
      "name price unavailableDates"
    );
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error in getMyBookings controller:", error.message);
    next(error);
  }
}

export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("roomId", "name price unavailableDates");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error("Error in getBooking controller:", error.message);
        next(error);
    }
};

export const updateBooking = async (req, res, next) => {
    try {
      const { checkInDate, checkOutDate } = req.body;
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
      const room = await Room.findById(booking.roomId);
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
  
      const existingBookings = await Booking.find({
        roomId: booking.roomId,
        _id: { $ne: req.params.id },
      });
      const requestedRange = generateDateRange(checkInDate, checkOutDate);
  
      const isUnavailable = existingBookings.some((otherBooking) => {
        const bookingRange = generateDateRange(otherBooking.checkInDate, otherBooking.checkOutDate);
        return requestedRange.some((date) => bookingRange.includes(date));
      });
  
      if (isUnavailable) {
        return res.status(409).json({
          success: false,
          message: `Room is unavailable from ${checkInDate} to ${checkOutDate}`,
        });
      }
  
      room.unavailableDates = room.unavailableDates.filter(
        (date) =>
          !(new Date(date) >= new Date(booking.checkInDate) && new Date(date) <= new Date(booking.checkOutDate))
      );
  
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
  
      room.unavailableDates = [...room.unavailableDates, ...requestedRange];
      await room.save();
  
      res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
      console.error("Error in updateBooking controller:", error.message);
      next(error);
    }
  };
export const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const room = await Room.findById(booking.roomId);
        if (room) {
            room.unavailableDates = room.unavailableDates.filter(date =>
                !(new Date(date) >= new Date(booking.checkInDate) && new Date(date) <= new Date(booking.checkOutDate))
            );
            await room.save();
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.status(202).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error in deleteBooking controller:", error.message);
        next(error);
    }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.confirmed = true;
    await booking.save();
    res.status(200).json({ message: "Booking confirmed!", booking });
  } catch (error) {
    res.status(500).json({ message: "Error confirming booking", error });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error });
  }
};

