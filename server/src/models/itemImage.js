// models/ItemImage.js
import mongoose from "mongoose";

const itemImageSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ItemImage", itemImageSchema);
