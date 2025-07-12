import User from "../models/user.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ErrorHandler("Unauthorized", 401);

    const { name } = req.body;
    let profileImageUrl;

    // If image file is uploaded
    if (req.file?.path) {
      profileImageUrl = await uploadToCloudinary(req.file.path, "profile");
      fs.unlinkSync(req.file.path); // delete local file after upload
    }

    const user = await User.findById(userId);
    if (!user) throw new ErrorHandler("User not found", 404);

    if (name) user.name = name;
    if (profileImageUrl) {
      user.profileImage = profileImageUrl;
    } else if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        points: user.points,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Server Error",
    });
  }
};
