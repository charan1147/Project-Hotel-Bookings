import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  }),
);

app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/booking", bookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5010;

await connectDB();
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
