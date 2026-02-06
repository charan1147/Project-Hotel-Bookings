import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    number: { type: Number, unique: true, required: true },
    status: {
      type: String,
      enum: ["available", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);

export default Room
