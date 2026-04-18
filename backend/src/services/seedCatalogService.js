const Category = require("../models/Category");
const Product = require("../models/Product");

const demoCategories = [
  {
    categoryId: "CAT-WOMEN",
    name: "Women",
    slug: "women",
    logo: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
    description: "Dresses, tops, denim, handbags, and occasion wear."
  },
  {
    categoryId: "CAT-MEN",
    name: "Men",
    slug: "men",
    logo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
    description: "Shirts, tees, jackets, sneakers, and smart-casual staples."
  },
  {
    categoryId: "CAT-KIDS",
    name: "Kids",
    slug: "kids",
    logo: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
    description: "Comfortwear, playful essentials, and easy daily outfits."
  },
  {
    categoryId: "CAT-SHOES",
    name: "Shoes",
    slug: "shoes",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    description: "Sneakers, heels, sandals, and occasion footwear."
  },
  {
    categoryId: "CAT-ACCESSORIES",
    name: "Accessories",
    slug: "accessories",
    logo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
    description: "Bags, watches, sunglasses, and finishing details."
  },
  {
    categoryId: "CAT-ETHNIC",
    name: "Ethnic",
    slug: "ethnic",
    logo: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1000&q=80",
    description: "Kurtas, sets, handcrafted textures, and festive looks."
  }
];

const demoProducts = [
  {
    productId: "PRD-WMN-001",
    title: "Floral Wrap Dress",
    slug: "floral-wrap-dress",
    description: "A lightweight day-to-evening dress with a flattering wrap silhouette.",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    cost: 2499,
    taxPercent: 5,
    stock: 18,
    categorySlug: "women"
  },
  {
    productId: "PRD-WMN-002",
    title: "Cotton Co-ord Set",
    slug: "cotton-coord-set",
    description: "Easy matching separates for brunch, travel, and casual outings.",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    cost: 3199,
    taxPercent: 5,
    stock: 14,
    categorySlug: "women"
  },
  {
    productId: "PRD-MEN-001",
    title: "Slim Fit Shirt",
    slug: "slim-fit-shirt",
    description: "Clean office-ready shirt with a crisp silhouette and soft feel.",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    cost: 1799,
    taxPercent: 5,
    stock: 22,
    categorySlug: "men"
  },
  {
    productId: "PRD-MEN-002",
    title: "Street Sneakers",
    slug: "street-sneakers",
    description: "Comfort-first sneakers built for everyday wear.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    cost: 3999,
    taxPercent: 5,
    stock: 11,
    categorySlug: "shoes"
  },
  {
    productId: "PRD-KDS-001",
    title: "Kids Everyday Tee",
    slug: "kids-everyday-tee",
    description: "Soft cotton tee designed for comfort and easy movement.",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    cost: 899,
    taxPercent: 0,
    stock: 25,
    categorySlug: "kids"
  },
  {
    productId: "PRD-ACC-001",
    title: "Classic Handbag",
    slug: "classic-handbag",
    description: "A structured everyday bag that completes the look.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    cost: 2799,
    taxPercent: 5,
    stock: 9,
    categorySlug: "accessories"
  },
  {
    productId: "PRD-ETH-001",
    title: "Festive Kurta Set",
    slug: "festive-kurta-set",
    description: "Traditional set with a modern finish for celebrations.",
    imageUrl: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1200&q=80",
    cost: 4499,
    taxPercent: 5,
    stock: 13,
    categorySlug: "ethnic"
  },
  {
    productId: "PRD-SHO-001",
    title: "Retro Runner",
    slug: "retro-runner",
    description: "A versatile sneaker with a vintage-inspired profile.",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
    cost: 3599,
    taxPercent: 5,
    stock: 16,
    categorySlug: "shoes"
  }
];

async function seedCatalog() {
  const existingCategories = await Category.countDocuments();
  const existingProducts = await Product.countDocuments();

  if (existingCategories > 0 || existingProducts > 0) {
    return { seeded: false, reason: "catalog already present" };
  }

  const categoryDocs = await Category.insertMany(demoCategories, { ordered: true });
  const categoryBySlug = new Map(categoryDocs.map((category) => [category.slug, category]));

  const productDocs = demoProducts.map((item, index) => ({
    productId: item.productId,
    title: item.title,
    slug: item.slug,
    description: item.description,
    imageUrl: item.imageUrl,
    cost: item.cost,
    taxPercent: item.taxPercent,
    stock: item.stock,
    category: categoryBySlug.get(item.categorySlug)?._id,
    isActive: true,
    createdAt: new Date(Date.now() - (demoProducts.length - index) * 60 * 1000),
    updatedAt: new Date()
  }));

  await Product.insertMany(productDocs, { ordered: true });

  return { seeded: true, categories: categoryDocs.length, products: productDocs.length };
}

module.exports = {
  seedCatalog
};