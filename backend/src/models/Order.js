const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0
    },
    taxPercent: {
      type: Number,
      default: 0,
      min: 0
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "Order requires at least one item"]
    },
    subTotal: {
      type: Number,
      required: true,
      min: 0
    },
    taxTotal: {
      type: Number,
      required: true,
      min: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["placed", "processing", "completed", "cancelled"],
      default: "placed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
