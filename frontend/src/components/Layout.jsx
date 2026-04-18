import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../context/AppStore";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/auth/login", label: "Login" },
  { to: "/auth/signup", label: "Sign up" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "Orders" },
  { to: "/admin/login", label: "Admin" }
];

function roleLabel(session) {
  if (session?.role === "admin") return "Admin";
  if (session?.role === "user") return session.user?.name || "Customer";
  return "Guest";
}

export default function Layout() {
  const { session, cartCount, signOut, toast, setToast } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  return (
    <div className="app-frame">
      <header className="site-header">
        <div>
          <p className="brand-kicker">Runway Portal</p>
          <div className="brand-row">
            <h1>Myntra-style fashion commerce</h1>
            <span className="status-dot" />
          </div>
          <p className="brand-subtitle">
            Separate user, cart, orders, and admin URLs with live backend integration.
          </p>
        </div>

        <div className="header-meta">
          <span className="pill">{roleLabel(session)}</span>
          <span className="pill">Cart {cartCount}</span>
          {session ? (
            <button type="button" className="secondary-btn" onClick={signOut}>
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <nav className="top-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="page-shell" data-route={location.pathname}>
        <Outlet />
      </main>

      {toast ? (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
