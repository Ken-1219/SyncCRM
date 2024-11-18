import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    totalSpending: {
      type: Number,
      default: 0,
    },
    visits: {
      type: Number,
      default: 0,
    },
    lastVisitDate: {
      type: Date,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    profilePicture: {
      type: String,
      default: null,
    },
    campaignEngagements: [
      {
        campaignName: { type: String, trim: true },
        dateSent: { type: Date },
        status: {
          type: String,
        },
        engagementMetrics: {
          clicks: { type: Number, default: 0 },
          opens: { type: Number, default: 0 },
        },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
