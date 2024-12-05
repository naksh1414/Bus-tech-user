import { Types } from "mongoose";

// User Role Enum
export enum UserRole {
  PASSENGER = "passenger",
  ADMIN = "admin",
  STAFF = "staff",
}

// User Document Interface
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  contactNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Data Transfer Object Interfaces
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  contactNumber?: string;
  gender?: string;
}

export interface UpdateUserDTO {
  name?: string;
  contactNumber?: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Authentication Interfaces
export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}

// Service Response Interfaces
export interface UserLoginResponse {
  user: Omit<IUser, "password">;
  token: string;
}

// Extended Request Interface for Authentication
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

// Validation Interfaces
export interface UserValidation {
  validateCreateUser(data: CreateUserDTO): void;
  validateUpdateUser(data: UpdateUserDTO): void;
  validateLogin(data: LoginDTO): void;
}

// User Query Interfaces
export interface UserQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// User Statistics Interface
export interface UserStatistics {
  totalUsers: number;
  usersByRole: {
    [key in UserRole]: number;
  };
  newUsersThisMonth: number;
}

// Detailed User Profile Interface
export interface UserProfile extends Omit<IUser, "password"> {
  bookings?: string[]; // Reference to bookings
  totalBookings?: number;
  lastBookingDate?: Date;
}

// Password Reset Interface
export interface PasswordResetRequest {
  email: string;
  token?: string;
  newPassword?: string;
  expiresAt?: Date;
}
