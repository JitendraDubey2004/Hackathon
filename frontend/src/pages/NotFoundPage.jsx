import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="empty-page card-glass">
      <p className="eyebrow">404</p>
      <h2>Page not found</h2>
      <p>The link you opened does not exist. Head back to the fashion store.</p>
      <div className="hero-actions">
        <Link className="primary-btn" to="/">
          Go home
        </Link>
        <Link className="secondary-btn" to="/shop">
          Shop now
        </Link>
      </div>
    </section>
  );
}
