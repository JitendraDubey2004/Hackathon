import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { money, getSessionRole } from "../utils/shop";
import { useAppStore } from "../context/AppStore";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, clearCart, session, setToast } = useAppStore();

  const checkoutMutation = useMutation({
    mutationFn: (items) => api.placeOrder(session.token, items),
    onSuccess: (data) => {
      clearCart();
      setToast({ type: "success", message: `Booking successful: ${data.order.orderNumber}` });
      navigate(`/success/${data.order.orderNumber}`, { state: { order: data.order } });
    }
  });

  const cartItems = cart.map((item) => ({
    ...item,
    lineTotal: item.quantity * Number(item.cost || 0) * (1 + Number(item.taxPercent || 0) / 100)
  }));

  const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const handleCheckout = () => {
    if (getSessionRole(session) !== "user") {
      setToast({ type: "error", message: "Please login as a customer to complete booking." });
      navigate("/auth/login?redirect=/cart");
      return;
    }

    checkoutMutation.mutate(cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity })));
  };

  return (
    <section className="page-stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Cart</p>
          <h2>Your selected looks</h2>
        </div>
        <Link className="text-link" to="/shop">
          Continue shopping
        </Link>
      </div>

      <div className="card-glass cart-layout">
        <div className="cart-list">
          {cartItems.length === 0 ? <p className="empty-page">Your cart is empty.</p> : null}
          {cartItems.map((item) => (
            <article key={item.productId} className="cart-item">
              <div className="cart-thumb">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <span>{item.title.charAt(0)}</span>}
              </div>
              <div className="cart-info">
                <strong>{item.title}</strong>
                <p>{money(item.cost)}</p>
                <small>Tax {item.taxPercent}%</small>
              </div>
              <div className="cart-actions">
                <input type="number" min="1" value={item.quantity} onChange={(e) => updateCartQuantity(item.productId, Number(e.target.value))} />
                <span>{money(item.lineTotal)}</span>
                <button type="button" className="link-btn" onClick={() => removeFromCart(item.productId)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h3>Quick checkout</h3>
          <div className="summary-row">
            <span>Items</span>
            <strong>{cartItems.length}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <button type="button" className="primary-btn full-width" onClick={handleCheckout} disabled={checkoutMutation.isPending}>
            {checkoutMutation.isPending ? "Placing order..." : "Complete order"}
          </button>
        </aside>
      </div>
    </section>
  );
}
