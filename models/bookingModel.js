import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    name: String,
    email: String,
    checkInDate: Date,
    checkOutDate: Date,
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
