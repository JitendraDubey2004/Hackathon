const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");
const { recordStockChange } = require("../services/stockHistoryService");

async function updateProductStock(req, res, next) {
  try {
    const { stock, reason } = req.body;
    const parsedStock = Number(stock);

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        message: "Stock must be a non-negative number",
        errorCode: "INVALID_STOCK"
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        errorCode: "PRODUCT_NOT_FOUND"
      });
    }

    const previousStock = product.stock;
    product.stock = parsedStock;
    await product.save();

    await recordStockChange({
      productId: product._id,
      previousStock,
      newStock: product.stock,
      changeType: "manual_update",
      reason: reason || "Manual stock update",
      updatedBy: req.user._id,
      updatedByModel: "Admin"
    });

    return res.status(200).json({
      message: "Stock updated",
      product
    });
  } catch (error) {
    return next(error);
  }
}

async function listStockHistory(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.productId) {
      filter.product = req.query.productId;
    }

    const [items, total] = await Promise.all([
      StockHistory.find(filter)
        .populate("product", "title productId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StockHistory.countDocuments(filter)
    ]);

    return res.status(200).json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listStockHistory,
  updateProductStock
};
