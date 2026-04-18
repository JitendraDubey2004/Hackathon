import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import { heroBanners, lifestyleTiles } from "../data/fashionAssets";
import { api } from "../api/client";
import { normalizeProduct } from "../utils/shop";
import { useAppStore } from "../context/AppStore";

export default function HomePage() {
  const { addToCart } = useAppStore();
  const categoriesQuery = useQuery({ queryKey: ["home-categories"], queryFn: api.listCategories });
  const productsQuery = useQuery({ queryKey: ["home-products"], queryFn: () => api.listProducts({ page: 1, limit: 8 }) });

  const products = (productsQuery.data?.items || []).map(normalizeProduct);
  const categories = categoriesQuery.data || [];

  return (
    <div className="page-stack">
      <section className="hero-grid">
        <div className="hero-copy card-glass">
          <p className="eyebrow">Fresh arrivals</p>
          <h2>Curated fashion for everyday and occasion wear.</h2>
          <p>
            Separate routes, styled like a modern fashion marketplace, with real authentication, cart persistence,
            orders, and admin workflows.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/shop">
              Explore the shop
            </Link>
            <Link className="secondary-btn" to="/auth/signup">
              Create account
            </Link>
          </div>
        </div>

        <div className="hero-mosaic">
          {heroBanners.slice(0, 3).map((banner) => (
            <article key={banner.title} className="mosaic-card">
              <img src={banner.image} alt={banner.title} />
              <div>
                <strong>{banner.title}</strong>
                <p>{banner.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Collections</p>
          <h2>Shop by lifestyle</h2>
        </div>
        <Link className="text-link" to="/shop">
          View all products
        </Link>
      </section>

      <section className="tile-grid">
        {lifestyleTiles.map((tile) => (
          <article key={tile.title} className="tile-card">
            <img src={tile.image} alt={tile.title} />
            <div>
              <h3>{tile.title}</h3>
              <p>{tile.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section-head" id="featured">
        <div>
          <p className="eyebrow">Featured</p>
          <h2>Trending products</h2>
        </div>
      </section>

      <section className="products-grid">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} actionLabel="Add to cart" onAction={addToCart} />
        ))}
      </section>

      <section className="stats-band card-glass">
        <div>
          <strong>{categories.length}+</strong>
          <span>fashion categories</span>
        </div>
        <div>
          <strong>Live</strong>
          <span>backend connected</span>
        </div>
        {/* <div>
          <strong>Secure</strong>
          <span>JWT + API key</span>
        </div> */}
      </section>
    </div>
  );
}
