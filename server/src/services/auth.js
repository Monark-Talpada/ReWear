import User from "../models/user.js";

export const getUserbyId = async (userId) => {
  return await User.findById(userId);
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
