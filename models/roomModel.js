import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 100 },
    description: { type: String, trim: true },
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
