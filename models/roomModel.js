import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    number: { type: Number, required: true, unique: true },
    status: {
      type: String,
      enum: ["available", "maintenance", "booked"],
      default: "available",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
