import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    number: { type: Number, unique: true, index: true },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    unavailableDates: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
