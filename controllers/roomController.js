import Room from "../models/roomModel.js";

export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to create room" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ number: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to get rooms" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to get room" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to update room" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room" });
  }
};
