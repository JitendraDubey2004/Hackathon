export function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}

export function getSessionRole(session) {
  return session?.role || session?.user?.role || session?.admin?.role || "guest";
}

export function normalizeProduct(product, index = 0) {
  return {
    id: product._id,
    productId: product.productId,
    title: product.title,
    description: product.description || "",
    imageUrl: product.imageUrl || "",
    cost: Number(product.cost || 0),
    formattedPrice: money(product.cost),
    taxPercent: Number(product.taxPercent || 0),
    stock: Number(product.stock || 0),
    categoryId: product.category?._id || product.category,
    categoryName: product.category?.name || "Uncategorized",
    raw: product
  };
}
