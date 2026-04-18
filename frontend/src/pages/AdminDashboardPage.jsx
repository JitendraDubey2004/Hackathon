import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api/client";
import { money, normalizeProduct } from "../utils/shop";
import { useAppStore } from "../context/AppStore";

const emptyCategoryForm = { categoryId: "", name: "", logo: "", description: "" };
const emptyProductForm = { productId: "", title: "", description: "", imageUrl: "", cost: "", taxPercent: "0", stock: "0", category: "" };

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { session, setToast } = useAppStore();
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [stockForm, setStockForm] = useState({ productId: "", stock: "0", reason: "" });

  const categoriesQuery = useQuery({ queryKey: ["admin-categories"], queryFn: api.listCategories });
  const productsQuery = useQuery({ queryKey: ["admin-products"], queryFn: () => api.listProducts({ page: 1, limit: 50 }) });
  const stockHistoryQuery = useQuery({
    queryKey: ["admin-stock-history", session?.token],
    queryFn: () => api.listStockHistory(session.token, { page: 1, limit: 20 }),
    enabled: Boolean(session?.token)
  });
  const ordersQuery = useQuery({
    queryKey: ["admin-orders", session?.token],
    queryFn: () => api.listAllOrders(session.token, { page: 1, limit: 20 }),
    enabled: Boolean(session?.token)
  });

  const products = useMemo(() => (productsQuery.data?.items || []).map(normalizeProduct), [productsQuery.data]);
  const categories = categoriesQuery.data || [];

  const createCategoryMutation = useMutation({
    mutationFn: (payload) => api.createCategory(session.token, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setCategoryForm(emptyCategoryForm);
      setToast({ type: "success", message: "Category created." });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (payload) => api.createProduct(session.token, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setProductForm(emptyProductForm);
      setToast({ type: "success", message: "Product created." });
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, payload }) => api.updateProductStock(session.token, productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-stock-history"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setStockForm({ productId: "", stock: "0", reason: "" });
      setToast({ type: "success", message: "Stock updated." });
    }
  });

  if (session?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <section className="page-stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h2>Catalog control center</h2>
        </div>
        <Link className="text-link" to="/shop">
          View shop
        </Link>
      </div>

      <section className="stats-band card-glass">
        <div>
          <strong>{categories.length}</strong>
          <span>categories</span>
        </div>
        <div>
          <strong>{products.length}</strong>
          <span>products</span>
        </div>
        <div>
          <strong>{(ordersQuery.data?.items || []).length}</strong>
          <span>orders</span>
        </div>
      </section>

      <section className="panel-grid admin-grid">
        <article className="panel card-glass">
          <h3>Create category</h3>
          <form className="form-grid" onSubmit={(event) => { event.preventDefault(); createCategoryMutation.mutate(categoryForm); }}>
            <label>
              Category ID
              <input value={categoryForm.categoryId} onChange={(e) => setCategoryForm((current) => ({ ...current, categoryId: e.target.value }))} />
            </label>
            <label>
              Name
              <input value={categoryForm.name} onChange={(e) => setCategoryForm((current) => ({ ...current, name: e.target.value }))} />
            </label>
            <label>
              Logo URL
              <input value={categoryForm.logo} onChange={(e) => setCategoryForm((current) => ({ ...current, logo: e.target.value }))} />
            </label>
            <label className="full-width">
              Description
              <textarea value={categoryForm.description} onChange={(e) => setCategoryForm((current) => ({ ...current, description: e.target.value }))} />
            </label>
            <button type="submit" className="primary-btn full-width">Save category</button>
          </form>
        </article>

        <article className="panel card-glass">
          <h3>Create product</h3>
          <form className="form-grid" onSubmit={(event) => { event.preventDefault(); createProductMutation.mutate(productForm); }}>
            <label>
              Product ID
              <input value={productForm.productId} onChange={(e) => setProductForm((current) => ({ ...current, productId: e.target.value }))} />
            </label>
            <label>
              Title
              <input value={productForm.title} onChange={(e) => setProductForm((current) => ({ ...current, title: e.target.value }))} />
            </label>
            <label>
              Category
              <select value={productForm.category} onChange={(e) => setProductForm((current) => ({ ...current, category: e.target.value }))}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Cost
              <input type="number" min="0" value={productForm.cost} onChange={(e) => setProductForm((current) => ({ ...current, cost: e.target.value }))} />
            </label>
            <label>
              Tax %
              <input type="number" min="0" value={productForm.taxPercent} onChange={(e) => setProductForm((current) => ({ ...current, taxPercent: e.target.value }))} />
            </label>
            <label>
              Stock
              <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm((current) => ({ ...current, stock: e.target.value }))} />
            </label>
            <label>
              Image URL
              <input value={productForm.imageUrl} onChange={(e) => setProductForm((current) => ({ ...current, imageUrl: e.target.value }))} />
            </label>
            <label className="full-width">
              Description
              <textarea value={productForm.description} onChange={(e) => setProductForm((current) => ({ ...current, description: e.target.value }))} />
            </label>
            <button type="submit" className="secondary-btn full-width">Save product</button>
          </form>
        </article>
      </section>

      <section className="panel-grid admin-grid">
        <article className="panel card-glass">
          <h3>Stock update</h3>
          <form className="form-grid" onSubmit={(event) => { event.preventDefault(); updateStockMutation.mutate({ productId: stockForm.productId, payload: { stock: stockForm.stock, reason: stockForm.reason } }); }}>
            <label>
              Product
              <select value={stockForm.productId} onChange={(e) => setStockForm((current) => ({ ...current, productId: e.target.value }))}>
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.title} ({product.productId})</option>
                ))}
              </select>
            </label>
            <label>
              Stock
              <input type="number" min="0" value={stockForm.stock} onChange={(e) => setStockForm((current) => ({ ...current, stock: e.target.value }))} />
            </label>
            <label className="full-width">
              Reason
              <input value={stockForm.reason} onChange={(e) => setStockForm((current) => ({ ...current, reason: e.target.value }))} />
            </label>
            <button type="submit" className="primary-btn full-width" disabled={!stockForm.productId}>Update stock</button>
          </form>
        </article>

        <article className="panel card-glass">
          <h3>Stock history</h3>
          <div className="orders-list">
            {(stockHistoryQuery.data?.items || []).map((entry) => (
              <div key={entry._id} className="order-card">
                <div className="order-header">
                  <strong>{entry.changeType}</strong>
                  <span>{new Date(entry.createdAt).toLocaleString()}</span>
                </div>
                <p>{entry.previousStock} → {entry.newStock}</p>
                <small>{entry.reason}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel-grid two-col">
        <article className="panel card-glass">
          <h3>Current categories</h3>
          <div className="orders-list">
            {categories.map((category) => (
              <div key={category._id} className="order-card">
                <strong>{category.name}</strong>
                <span>{category.categoryId}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel card-glass">
          <h3>Current products</h3>
          <div className="orders-list">
            {products.map((product) => (
              <div key={product.id} className="order-card">
                <strong>{product.title}</strong>
                <span>{money(product.cost)}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
