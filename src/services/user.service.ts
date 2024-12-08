import { User } from "../models/user";
import { CreateUserDTO, UpdateUserDTO, LoginDTO } from "../types/user.types";
import { PasswordUtil } from "../utils/password";
import { JWTUtil } from "../utils/jwt";

export class UserService {
  async createUser(userData: CreateUserDTO) {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await PasswordUtil.hash(userData.password);

    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    await user.save();
    return user.toObject();
  }

  async login(loginData: LoginDTO) {
    const user = await User.findOne({ email: loginData.email }).select(
      "+password"
    );

    if (!user) {
      throw new Error("User Not Found");
    }

    const isValidPassword = await PasswordUtil.compare(
      loginData.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = JWTUtil.generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: user.toObject(),
      token,
    };
  }

  async getUserProfile(userId: string) {
    return User.findById(userId).select("-password").lean();
  }

  async updateUser(userId: string, updateData: UpdateUserDTO) {
    return User.findByIdAndUpdate(userId, updateData, { new: true }).select(
      "-password"
    );
  }
}
