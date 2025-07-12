import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ErrorHandler } from "../utils/errorHandler.js";

export const AuthCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ErrorHandler("Authentication token is missing or invalid.", 403);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SCRECT_KEY);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ErrorHandler("User not found", 404);
    req.user = user;
    next();
  } catch (error) {
    throw new ErrorHandler(
      error.message || "Unauthorized - Invalid token",
      404
    );
  }
};
