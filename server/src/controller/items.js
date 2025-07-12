import fs from "fs";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import Item from "../models/Item.js";
import ItemImage from "../models/ItemImage.js";
import { ErrorHandler } from "../utils/errorHandler.js";

export const createItem = async (req, res) => {
  try {
    const { title, description, category, type, size, condition } = req.body;
    const uploader = req.user.id;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and image required" });
    }

    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : JSON.parse(req.body.tags || "[]");

    // Step 1: Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.path, "items");
    fs.unlinkSync(req.file.path); // Clean up local file

    // Step 2: Create the item
    const item = await Item.create({
      uploader,
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags,
    });

    // Step 3: Save image in separate ItemImage model
    const itemImage = new ItemImage({
      item: item._id,
      imageUrl,
    });
    await itemImage.save();

    res.status(201).json({
      message: "Item created successfully",
      item: {
        ...item.toObject(),
        imageUrl, // Include the image URL in the response
      },
    });
  } catch (err) {
    throw new ErrorHandler(error.message || "server error", 500);
  }
};

export const getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Item.find({ uploader: userId }).sort({ createdAt: -1 });

    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const image = await ItemImage.findOne({ item: item._id });
        return {
          ...item.toObject(),
          imageUrl: image?.imageUrl || null,
        };
      })
    );

    res.status(200).json({
      message: "User's listed items fetched successfully",
      listedItems: itemsWithImages,
    });
  } catch (error) {
    throw new ErrorHandler(error.message || "server error", 500);
  }
};


export const getCurrentItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Find the image for this item
    const image = await ItemImage.findOne({ item: item._id });

    res.status(200).json({
      message: "Item fetched successfully",
      item: {
        ...item.toObject(),
        imageUrl: image?.imageUrl || null,
      },
    });
  } catch (error) {
    throw new ErrorHandler(error.message || "server error", 500);
  }
};