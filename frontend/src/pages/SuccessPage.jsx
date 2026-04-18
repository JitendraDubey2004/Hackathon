import { Link, useLocation, useParams } from "react-router-dom";
import { money } from "../utils/shop";

export default function SuccessPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <section className="success-shell card-glass">
      <p className="eyebrow">Booking successful</p>
      <h2>Order {orderNumber} confirmed</h2>
      <p>
        Your fashion booking was placed successfully. You can revisit your orders page or continue shopping for more looks.
      </p>
      {order ? (
        <div className="success-summary">
          <div>
            <span>Total</span>
            <strong>{money(order.grandTotal)}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{order.status}</strong>
          </div>
        </div>
      ) : null}
      <div className="hero-actions">
        <Link className="primary-btn" to="/orders">
          View orders
        </Link>
        <Link className="secondary-btn" to="/shop">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
