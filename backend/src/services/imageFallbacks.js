const productFallbackImages = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
];

const categoryFallbackImages = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1000&q=80"
];

function pickFallbackImage(list, key, offset = 0) {
  if (!list.length) {
    return "";
  }

  const source = String(key || "default");
  let hash = offset;

  for (const char of source) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return list[hash % list.length];
}

function getProductFallbackImage(key, offset = 0) {
  return pickFallbackImage(productFallbackImages, key, offset);
}

function getCategoryFallbackImage(key, offset = 0) {
  return pickFallbackImage(categoryFallbackImages, key, offset);
}

module.exports = {
  getCategoryFallbackImage,
  getProductFallbackImage
};
