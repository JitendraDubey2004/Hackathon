const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: [true, "Category ID is required"],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    logo: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
