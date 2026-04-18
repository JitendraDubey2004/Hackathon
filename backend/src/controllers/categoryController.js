const Category = require("../models/Category");
const { getCategoryFallbackImage } = require("../services/imageFallbacks");

function buildCategoryPayload(body) {
  const name = body.name?.trim();
  const categoryId = body.categoryId?.trim();
  const slug = (body.slug || name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return {
    categoryId,
    name,
    slug,
    logo: body.logo || "",
    description: body.description || "",
    isActive: body.isActive ?? true
  };
}

async function createCategory(req, res, next) {
  try {
    const payload = buildCategoryPayload(req.body);
    const category = await Category.create(payload);
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(
      categories.map((category) => ({
        ...category.toObject(),
        logo: category.logo || getCategoryFallbackImage(category.categoryId || category.name)
      }))
    );
  } catch (error) {
    return next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        errorCode: "CATEGORY_NOT_FOUND"
      });
    }

    return res.status(200).json({
      ...category.toObject(),
      logo: category.logo || getCategoryFallbackImage(category.categoryId || category.name)
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        errorCode: "CATEGORY_NOT_FOUND"
      });
    }

    const payload = buildCategoryPayload({
      ...existingCategory.toObject(),
      ...req.body,
      categoryId: req.body.categoryId || existingCategory.categoryId
    });

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
        errorCode: "CATEGORY_NOT_FOUND"
      });
    }

    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory
};
