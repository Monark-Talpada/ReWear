import User from "../models/user.js";
import { getUserByEmail, getUserbyId } from "../services/auth.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { genrateToken } from "../utils/jwt.js";
import { loginSchema, registerSchema } from "../validation/auth.js";

export const register = async (req, res) => {
  try {
    const validated = registerSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors[0].message;
      throw new ErrorHandler(errors, 400);
    }

    const { name, email, password } = validated.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) throw new ErrorHandler("User already exists", 400);

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    throw new ErrorHandler(
      error.message || "Registration failed",
      error.status || 500
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validated = loginSchema.safeParse({ email, password });

    if (!validated.success) {
      const errors = validated.error.errors[0].message;
      throw new ErrorHandler(errors, 400);
    }

    const user = await getUserByEmail(email);

    if (!user) throw new ErrorHandler("Invalid email or password", 401);

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid)
      throw new ErrorHandler("Invalid email or password", 401);

    const token = genrateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(
      error.message || "Login failed",
      error.status || 500
    );
  }
};

export const getAuthUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    throw new ErrorHandler(
      error.message || "fatch user failed",
      error.status || 500
    );
  }
};
