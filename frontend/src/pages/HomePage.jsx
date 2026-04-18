import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../api/client";
import { normalizeProduct } from "../utils/shop";
import { useAppStore } from "../context/AppStore";

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useAppStore();
  const contentQuery = useQuery({ queryKey: ["home-content"], queryFn: api.getHomeContent });

  const products = (contentQuery.data?.featuredProducts || []).map(normalizeProduct);
  const heroBanners = contentQuery.data?.heroBanners || [];
  const collectionTiles = contentQuery.data?.collectionTiles || [];

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
          {heroBanners.map((banner) => (
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
          <h2>Shop by category</h2>
        </div>
        <Link className="text-link" to="/shop">
          View all products
        </Link>
      </section>

      <section className="tile-grid">
        {collectionTiles.slice(0, 4).map((tile) => (
          <Link key={tile.id || tile.title} className="tile-card link-card" to={tile.id ? `/shop?category=${tile.id}` : "/shop"}>
            <img src={tile.image} alt={tile.title} />
            <div>
              <h3>{tile.title}</h3>
              <p>{tile.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="section-head" id="featured">
        <div>
          <p className="eyebrow">Featured</p>
          <h2>Trending products</h2>
        </div>
      </section>

      <section className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            actionLabel="Add to cart"
            onAction={addToCart}
            secondaryActionLabel="Buy now"
            onSecondaryAction={(item) => {
              addToCart(item);
              navigate("/cart");
            }}
          />
        ))}
      </section>

      <section className="stats-band card-glass">
        <div>
          <strong>{collectionTiles.length}+</strong>
          <span>fashion categories</span>
        </div>
        {/* <div>
          <strong>Live</strong>
          <span>backend connected</span>
        </div> */}
        {/* <div>
          <strong>Secure</strong>
          <span>JWT + API key</span>
        </div> */}
      </section>

      <footer className="home-footer card-glass">
        <div className="footer-brand">
          <p className="eyebrow">Connect with us</p>
          <h3>Stay close to new drops, orders, and admin updates.</h3>
          <p>
            A lightweight retail demo with live MongoDB-backed catalog, customer flow, and a separate admin portal.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Shop</strong>
            <Link to="/shop">All products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </div>
          <div>
            <strong>Connect</strong>
            <a href="mailto:@fashiontechriders.com">@fashiontechriders.com</a>
            <a href="tel:+911234567890">+91 12345 67890</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <div>
            <strong>Admin</strong>
            <Link to="/admin/login">Admin login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
