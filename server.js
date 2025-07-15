import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

dotenv.config();
const app = express();

// ✅ Safer CORS config that supports both localhost & production
const allowedOrigins = [
  "http://localhost:5173", // Dev frontend
  "https://your-production-url.com", // Replace with your actual deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/booking", bookingRoutes);

// Central Error Handler
app.use(errorHandler);

// Start server after connecting to DB
const PORT = process.env.PORT || 5010;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
