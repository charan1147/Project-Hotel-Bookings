import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb is conneceted");
        
    } catch (error) {
        console.error(`Error while connecting DataBase`,error.message);
        process.exit(1)
        
        
    }

    
}

export default connectDB