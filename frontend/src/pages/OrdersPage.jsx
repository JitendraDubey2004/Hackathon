import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { money, getSessionRole } from "../utils/shop";
import { useAppStore } from "../context/AppStore";

export default function OrdersPage() {
  const { session, setToast } = useAppStore();
  const role = getSessionRole(session);
  const ordersQuery = useQuery({
    queryKey: ["my-orders", session?.token],
    queryFn: () => api.getMyOrders(session.token, { page: 1, limit: 20 }),
    enabled: role === "user" && Boolean(session?.token)
  });

  if (role !== "user") {
    return (
      <div className="empty-page card-glass">
        <h2>Sign in to see bookings</h2>
        <p>Your order history and quick reorder live here after customer login.</p>
        <Link to="/auth/login" className="primary-btn">
          Login now
        </Link>
      </div>
    );
  }

  const handleReorder = async (orderId) => {
    try {
      const data = await api.reorder(session.token, orderId);
      setToast({ type: "success", message: `Reorder successful: ${data.order.orderNumber}` });
    } catch (error) {
      setToast({ type: "error", message: error?.response?.data?.message || "Reorder failed" });
    }
  };

  return (
    <section className="page-stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Orders</p>
          <h2>Your bookings</h2>
        </div>
      </div>

      <div className="orders-grid">
        {(ordersQuery.data?.items || []).map((order) => (
          <article key={order._id} className="order-card large">
            <div className="order-header">
              <strong>{order.orderNumber}</strong>
              <span>{money(order.grandTotal)}</span>
            </div>
            <p>{order.items.length} item(s) • {order.status}</p>
            <button type="button" className="secondary-btn" onClick={() => handleReorder(order._id)}>
              Reorder
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
