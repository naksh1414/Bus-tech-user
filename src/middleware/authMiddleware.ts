import { Request, Response, NextFunction } from "express";
import { JWTUtil } from "../utils/jwt";
import { UserRole } from "../types/user.types";

// Authentication Middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = JWTUtil.verifyToken(token);

    // Attach user information to the request
    req.user = {
      userId: decoded.userId,
      role: decoded.role as UserRole,
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of token verification errors
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expired" });
        return;
      }
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
        return;
      }
    }

    // Generic error response for other unexpected errors
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Role-based Authorization Middleware
export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Ensure user is authenticated first
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    // Check if user's role is in the allowed roles
    if (req.user.role && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Insufficient permissions" });
    }
  };
};
