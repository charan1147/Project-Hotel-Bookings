import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    number: { type: Number, required: true, unique: true, index: true },
    status: { type: String, default: "available", enum: ["available", "unavailable"] },
    unavailableDates: [{ type: String }],
  },
  { timestamps: true }
);

roomSchema.methods.toggleAvailability = function () {
  this.status = this.status === "available" ? "unavailable" : "available";
  return this.save();
};

const Room = mongoose.model("Room", roomSchema);

export default Room;