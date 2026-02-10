import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ userId: 1 });

bookingSchema.virtual("nights").get(function () {
  if (!this.checkIn || !this.checkOut) return 0;
  const diffMs = this.checkOut - this.checkIn;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

bookingSchema.virtual("totalPrice").get(function () {
  return this.nights * (this.roomId?.price || 0);
});

bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

export default mongoose.model("Booking", bookingSchema);
