import Room from "../models/roomModel.js";

export const createRooms = async (req, res, next) => {
    try {
        const room = await Room.create(req.body);

        if (!room) {
            return res.status(400).json({ success: false, message: "Room creation failed" });
        }

        res.status(201).json({
            success: true,
            data: room,
            message: "Room created successfully",
        });
    } catch (error) {
        console.error("Error in createRooms Controller:", error.message);
        next(error);
    }
};

export const getRooms = async (req, res, next) => {
    try {
      const rooms = await Room.find();
      if (rooms.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No rooms found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: rooms,
        message: "Fetched all rooms successfully",
      });
    } catch (error) {
      console.error("Error in getRooms Controller:", error.message);
      next(error);
    }
  };
export const getRoom = async (req, res, next) => {
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
            message: "Room fetched successfully",
        });
    } catch (error) {
        console.error("Error in getRoom Controller:", error.message);
        next(error);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({
                success: false,
                message: "Room update failed",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedRoom,
            message: "Room updated successfully",
        });
    } catch (error) {
        console.error("Error in updateRoom Controller:", error.message);
        next(error);
    }
};

export const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room deletion failed",
            });
        }

        res.status(200).json({
            success: true,
            id: req.params.id,
            message: "Room deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteRoom Controller:", error.message);
        next(error);
    }
};
