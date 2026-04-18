const Product = require("../models/Product");
const Category = require("../models/Category");
const { recordStockChange } = require("../services/stockHistoryService");

function buildProductPayload(body) {
  const title = body.title?.trim();
  const productId = body.productId?.trim();
  const slug = (body.slug || title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return {
    productId,
    title,
    slug,
    description: body.description || "",
    imageUrl: body.imageUrl || body.image || "",
    cost: Number(body.cost || 0),
    taxPercent: Number(body.taxPercent || 0),
    stock: Number(body.stock || 0),
    category: body.category,
    isActive: body.isActive ?? true
  };
}

async function createProduct(req, res, next) {
  try {
    const payload = buildProductPayload(req.body);
    const existingCategory = await Category.findById(payload.category);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        errorCode: "CATEGORY_NOT_FOUND"
      });
    }

    const product = await Product.create(payload);

    await recordStockChange({
      productId: product._id,
      previousStock: 0,
      newStock: product.stock,
      changeType: "initial",
      reason: "Initial product stock",
      updatedBy: req.user?._id,
      updatedByModel: req.user?.role === "admin" ? "Admin" : "User"
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function listProducts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 100);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const category = req.query.category;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } }
      ];
    }
    if (category) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
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

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        errorCode: "PRODUCT_NOT_FOUND"
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
        errorCode: "PRODUCT_NOT_FOUND"
      });
    }

    const payload = buildProductPayload({
      ...existingProduct.toObject(),
      ...req.body,
      productId: req.body.productId || existingProduct.productId
    });

    const existingCategory = await Category.findById(payload.category);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        errorCode: "CATEGORY_NOT_FOUND"
      });
    }

    const previousStock = existingProduct.stock;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    }).populate("category");

    await recordStockChange({
      productId: updatedProduct._id,
      previousStock,
      newStock: updatedProduct.stock,
      changeType: "manual_update",
      reason: "Updated from product API",
      updatedBy: req.user?._id,
      updatedByModel: req.user?.role === "admin" ? "Admin" : "User"
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
        errorCode: "PRODUCT_NOT_FOUND"
      });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
};
