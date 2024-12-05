import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes";
import { connectDatabase } from "../config/database";
dotenv.config();
// Load environment variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8080;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
