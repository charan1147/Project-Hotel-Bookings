import Room from "../models/roomModel.js";

export const createRoom = async (req, res) => {
  try {
    const { name, price, description, number, status } = req.body;

    if (!name || !price || !number) {
      return res
        .status(400)
        .json({ message: "Name, price, and room number are required" });
    }

    if (price < 100) {
      return res.status(400).json({ message: "Price must be at least 100" });
    }

    const existingRoom = await Room.findOne({ number });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: `Room number ${number} is already in use` });
    }

    const room = await Room.create({
      name,
      price,
      description: description || "",
      number,
      status: status || "available",
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room",
      error: error.message,
    });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ number: 1 }); 

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, 
      { new: true, runValidators: true },
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update room",
      error: error.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete room",
      error: error.message,
    });
  }
};
