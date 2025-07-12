// models/AdminAction.js
import mongoose from "mongoose";

const adminActionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    action: {
      type: String,
      enum: ["approve", "reject", "remove"],
      required: true,
    },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("AdminAction", adminActionSchema);
