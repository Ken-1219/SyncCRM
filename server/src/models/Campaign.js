import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Completed"],
      default: "Draft",
    },
    content: {
      type: String,
      required: [true, "Campaign content is required"],
    },
    audience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    image: {
      type: String,
      trim: true,
      default: null,
    },
    scheduledDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);

export default Campaign;
