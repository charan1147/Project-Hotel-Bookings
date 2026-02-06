import Room from "../models/roomModel.js";

export const createRooms = async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json({
    success: true,
    data: room,
    message: "Room created successfully",
  });
};


export const getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json({
    success: true,
    data: rooms,
  });
};


export const getRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room)
    return res.status(404).json({ success: false, message: "Room not found" });

  res.json({
    success: true,
    data: room,
  });
};


export const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!room)
    return res.status(404).json({ success: false, message: "Room not found" });

  res.json({
    success: true,
    data: room,
    message: "Room updated successfully",
  });
};


export const deleteRoom = async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room)
    return res.status(404).json({ success: false, message: "Room not found" });

  res.json({
    success: true,
    message: "Room deleted successfully",
  });
};
