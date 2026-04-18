const Category = require("../models/Category");
const Product = require("../models/Product");
const { getCategoryFallbackImage, getProductFallbackImage } = require("../services/imageFallbacks");

function formatInr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(value || 0));
}

async function getHomeContent(req, res, next) {
  try {
    const [categories, products] = await Promise.all([
      Category.find({ isActive: true }).sort({ createdAt: -1 }).limit(8),
      Product.find({ isActive: true })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(24)
    ]);

    const heroBanners = products
      .slice(0, 4)
      .map((product) => ({
        id: product._id,
        title: product.title,
        subtitle: product.description || `Trending from ${product.category?.name || "our collection"}`,
        priceInr: formatInr(product.cost),
        image: product.imageUrl || getProductFallbackImage(product.productId || product.title)
      }));

    const categoryImageById = new Map();
    for (const product of products) {
      const categoryId = product.category?._id?.toString();
      if (!categoryId || categoryImageById.has(categoryId)) {
        continue;
      }

      if (product.imageUrl) {
        categoryImageById.set(categoryId, product.imageUrl);
      }
    }

    const collectionTiles = categories.slice(0, 6).map((category) => ({
      id: category._id,
      title: category.name,
      description: category.description || `${category.name} styles`,
      image:
        category.logo || categoryImageById.get(category._id.toString()) || getCategoryFallbackImage(category.categoryId || category.name)
    }));

    return res.status(200).json({
      heroBanners,
      collectionTiles,
      featuredProducts: products.slice(0, 8)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getHomeContent
};
