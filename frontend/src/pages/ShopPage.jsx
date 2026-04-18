import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";
import { normalizeProduct } from "../utils/shop";
import { useAppStore } from "../context/AppStore";

export default function ShopPage() {
  const navigate = useNavigate();
  const { addToCart } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || "";
  const limit = Number(searchParams.get("limit") || 12);

  const categoriesQuery = useQuery({ queryKey: ["shop-categories"], queryFn: api.listCategories });
  const productsQuery = useQuery({
    queryKey: ["shop-products", limit, search, categoryId],
    queryFn: () =>
      api.listProducts({
        page: 1,
        limit,
        search,
        category: categoryId
      })
  });

  const categories = categoriesQuery.data || [];
  const products = (productsQuery.data?.items || []).map(normalizeProduct);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="page-stack">
      <section className="section-head">
        <div>
          <p className="eyebrow">Shop</p>
          <h2>Browse fashion by style, color, and vibe</h2>
        </div>
        <Link className="text-link" to="/cart">
          Open cart
        </Link>
      </section>

      <section className="card-glass filter-bar">
        <input value={search} onChange={(e) => updateParam("q", e.target.value)} placeholder="Search dresses, shirts, shoes, bags..." />
        <select value={categoryId} onChange={(e) => updateParam("category", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </section>

      <section className="chips-row">
        <button type="button" className={!categoryId ? "chip active" : "chip"} onClick={() => updateParam("category", "")}>
          All styles
        </button>
        {categories.map((category) => (
          <button key={category._id} type="button" className={categoryId === category._id ? "chip active" : "chip"} onClick={() => updateParam("category", category._id)}>
            {category.name}
          </button>
        ))}
      </section>

      <section className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAction={addToCart}
            onSecondaryAction={(item) => {
              addToCart(item);
              navigate("/cart");
            }}
          />
        ))}
      </section>

      {products.length === 0 ? (
        <div className="empty-page card-glass">
          <h2>No products found</h2>
          <p>Try another category or search term.</p>
        </div>
      ) : null}

      <div className="load-more-wrap">
        <button type="button" className="secondary-btn" onClick={() => updateParam("limit", String(limit + 12))}>
          Load more
        </button>
      </div>
    </div>
  );
}
