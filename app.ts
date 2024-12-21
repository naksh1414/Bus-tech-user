import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { userRoutes } from "./src/routes/user.routes";
import { connectDatabase } from "./config/database";
dotenv.config();
// Load environment variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/health", (_, res) => {
  res.send("User Service is running");
});

const PORT = 8080;

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
