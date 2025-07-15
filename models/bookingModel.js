import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema(
    {
        roomId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Room", 
            required: true,
            index: true 
        },
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
          
        },
        checkInDate: { 
            type: Date, 
            required: true 
        },
        checkOutDate: { 
            type: Date, 
            required: true,
            validate: { 
                validator: function (value) {
                    return value > this.checkInDate; 
                },
                message: "Check-out date must be after check-in date"
            }
        },
        confirmed: { 
            type: Boolean, 
            default: false 
        }
    },
    { 
        timestamps: true 
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
