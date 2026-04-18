export const heroBanners = [
  {
    title: "New season drops",
    subtitle: "Elevated essentials for women, men, and kids.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Streetwear edits",
    subtitle: "Clean silhouettes, premium layering, and statement sneakers.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Occasion looks",
    subtitle: "Dress up for office, weddings, brunch, and celebrations.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
  }
];

export const fashionFallbacks = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
];

export const lifestyleTiles = [
  {
    title: "Women",
    description: "Kurtas, dresses, tops, denim, and accessories.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Men",
    description: "T-shirts, shirts, sneakers, jackets, and smart casuals.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Kids",
    description: "Playful outfits, footwear, and daily comfortwear.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Shoes",
    description: "Sneakers, heels, sandals, and occasion footwear.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
  }
];

export function getFallbackImage(index = 0) {
  return fashionFallbacks[index % fashionFallbacks.length];
}
