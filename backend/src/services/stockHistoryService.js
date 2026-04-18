const StockHistory = require("../models/StockHistory");

async function recordStockChange({
  productId,
  previousStock,
  newStock,
  changeType,
  reason = "",
  updatedBy,
  updatedByModel
}) {
  if (previousStock === newStock) {
    return null;
  }

  return StockHistory.create({
    product: productId,
    previousStock,
    newStock,
    changeType,
    reason,
    updatedBy,
    updatedByModel
  });
}

module.exports = {
  recordStockChange
};
