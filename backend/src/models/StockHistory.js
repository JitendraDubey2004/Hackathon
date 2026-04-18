const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0
    },
    newStock: {
      type: Number,
      required: true,
      min: 0
    },
    changeType: {
      type: String,
      enum: ["initial", "manual_update", "order_placed", "order_reverted"],
      required: true
    },
    reason: {
      type: String,
      default: ""
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "updatedByModel"
    },
    updatedByModel: {
      type: String,
      enum: ["Admin", "User"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockHistory", stockHistorySchema);
