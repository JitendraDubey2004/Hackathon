import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="auth/login" element={<AuthPage mode="login" />} />
        <Route path="auth/signup" element={<AuthPage mode="signup" />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="success/:orderNumber" element={<SuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
