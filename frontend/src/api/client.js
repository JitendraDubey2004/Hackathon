import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const apiKey = import.meta.env.VITE_API_KEY || "hackthon_api_key_change_this";

const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey
  }
});

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrap(response) {
  return response.data;
}

export const api = {
  getHealth: async () => unwrap(await http.get("/health")),

  signupUser: async (payload) => unwrap(await http.post("/auth/signup", payload)),
  loginUser: async (payload) => unwrap(await http.post("/auth/login", payload)),
  getUserProfile: async (token) => unwrap(await http.get("/auth/profile", { headers: authHeaders(token) })),

  loginAdmin: async (payload) => unwrap(await http.post("/admin/login", payload)),
  getAdminProfile: async (token) => unwrap(await http.get("/admin/profile", { headers: authHeaders(token) })),

  listCategories: async () => unwrap(await http.get("/categories")),
  createCategory: async (token, payload) =>
    unwrap(await http.post("/admin/categories", payload, { headers: authHeaders(token) })),
  updateCategory: async (token, id, payload) =>
    unwrap(await http.put(`/admin/categories/${id}`, payload, { headers: authHeaders(token) })),
  deleteCategory: async (token, id) =>
    unwrap(await http.delete(`/admin/categories/${id}`, { headers: authHeaders(token) })),

  listProducts: async ({ page = 1, limit = 12, search = "", category = "" } = {}) =>
    unwrap(await http.get("/products", { params: { page, limit, search, category } })),
  getProduct: async (id) => unwrap(await http.get(`/products/${id}`)),
  createProduct: async (token, payload) =>
    unwrap(await http.post("/admin/products", payload, { headers: authHeaders(token) })),
  updateProduct: async (token, id, payload) =>
    unwrap(await http.put(`/admin/products/${id}`, payload, { headers: authHeaders(token) })),
  deleteProduct: async (token, id) =>
    unwrap(await http.delete(`/admin/products/${id}`, { headers: authHeaders(token) })),
  updateProductStock: async (token, id, payload) =>
    unwrap(await http.patch(`/admin/products/${id}/stock`, payload, { headers: authHeaders(token) })),
  listStockHistory: async (token, params = {}) =>
    unwrap(await http.get("/admin/stock-history", { headers: authHeaders(token), params })),

  placeOrder: async (token, items) => unwrap(await http.post("/orders", { items }, { headers: authHeaders(token) })),
  getMyOrders: async (token, params = {}) =>
    unwrap(await http.get("/orders", { headers: authHeaders(token), params })),
  reorder: async (token, id) =>
    unwrap(await http.post(`/orders/${id}/reorder`, {}, { headers: authHeaders(token) })),
  listAllOrders: async (token, params = {}) =>
    unwrap(await http.get("/orders/admin/all", { headers: authHeaders(token), params }))
};

export { baseURL, apiKey };
