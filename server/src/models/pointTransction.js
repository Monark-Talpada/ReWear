// models/PointsTransaction.js
import mongoose from "mongoose";

const pointsTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["earned", "spent", "adjusted"],
      required: true,
    },
    points: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("PointsTransaction", pointsTransactionSchema);
