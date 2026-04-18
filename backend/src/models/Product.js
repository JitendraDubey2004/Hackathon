const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    imageUrl: {
      type: String,
      default: ""
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: 0
    },
    taxPercent: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
