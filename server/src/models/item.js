// models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    type: { type: String },
    size: { type: String },
    condition: { type: String },
    status: {
      type: String,
      enum: ["available", "pending", "swapped", "removed"],
      default: "available",
    },
    isApproved: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
