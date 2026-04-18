const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { recordStockChange } = require("../services/stockHistoryService");

function buildOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ORD-${stamp}-${random}`;
}

async function buildOrderFromItems(items, user, session) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      error: {
        status: 400,
        message: "Order requires at least one item",
        errorCode: "ORDER_ITEMS_REQUIRED"
      }
    };
  }

  const orderItems = [];
  let subTotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const quantity = Number(item.quantity || 0);
    if (!mongoose.Types.ObjectId.isValid(item.productId) || quantity <= 0) {
      return {
        error: {
          status: 400,
          message: "Each item must include a valid productId and positive quantity",
          errorCode: "INVALID_ORDER_ITEM"
        }
      };
    }

    const product = await Product.findById(item.productId).session(session);
    if (!product || !product.isActive) {
      return {
        error: {
          status: 404,
          message: "Product not found or inactive",
          errorCode: "PRODUCT_NOT_FOUND"
        }
      };
    }

    if (product.stock < quantity) {
      return {
        error: {
          status: 409,
          message: `Insufficient stock for ${product.title}`,
          errorCode: "INSUFFICIENT_STOCK"
        }
      };
    }

    const unitCost = Number(product.cost);
    const taxPercent = Number(product.taxPercent || 0);
    const baseLine = unitCost * quantity;
    const lineTax = (baseLine * taxPercent) / 100;
    const lineTotal = baseLine + lineTax;

    subTotal += baseLine;
    taxTotal += lineTax;

    orderItems.push({
      product: product._id,
      title: product.title,
      quantity,
      unitCost,
      taxPercent,
      lineTotal
    });

    const previousStock = product.stock;
    product.stock = previousStock - quantity;
    await product.save({ session });

    await recordStockChange({
      productId: product._id,
      previousStock,
      newStock: product.stock,
      changeType: "order_placed",
      reason: "Stock reduced due to order placement",
      updatedBy: user._id,
      updatedByModel: "User"
    });
  }

  return {
    payload: {
      orderNumber: buildOrderNumber(),
      user: user._id,
      items: orderItems,
      subTotal,
      taxTotal,
      grandTotal: subTotal + taxTotal
    }
  };
}

async function placeOrder(req, res, next) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const buildResult = await buildOrderFromItems(req.body.items, req.user, session);
    if (buildResult.error) {
      await session.abortTransaction();
      return res.status(buildResult.error.status).json(buildResult.error);
    }

    const [order] = await Order.create([buildResult.payload], { session });
    await session.commitTransaction();

    return res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
}

async function listMyOrders(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user._id })
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

async function quickReorder(req, res, next) {
  try {
    const existingOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
        errorCode: "ORDER_NOT_FOUND"
      });
    }

    req.body.items = existingOrder.items.map((item) => ({
      productId: item.product,
      quantity: item.quantity
    }));

    return placeOrder(req, res, next);
  } catch (error) {
    return next(error);
  }
}

async function listAllOrders(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments()
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
  listAllOrders,
  listMyOrders,
  placeOrder,
  quickReorder
};
