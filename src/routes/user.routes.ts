import express from "express";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middleware/authMiddleware";
import { CreateUserDTO, UpdateUserDTO, LoginDTO } from "../types/user.types";

const router = express.Router();
const userService = new UserService();

// User Registration Route
router.post("/register", async (req, res) => {
  try {
    const userData: CreateUserDTO = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  try {
    const loginData: LoginDTO = req.body;
    const { user, token } = await userService.login(loginData);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

// Get User Profile Route (Protected)
router.get("/profile", [authMiddleware], async (req: any, res: any) => {
  try {
    // The userId is attached to the request by the authMiddleware
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userService.getUserProfile(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching profile" });
  }
});

// Update User Profile Route (Protected)
router.put("/profile", [authMiddleware], async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData: UpdateUserDTO = req.body;
    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

export const userRoutes = router;
