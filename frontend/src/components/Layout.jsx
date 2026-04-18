import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../context/AppStore";

function roleLabel(session) {
  if (session?.role === "admin") return "Admin";
  if (session?.role === "user") return session.user?.name || "Customer";
  return "Guest";
}

export default function Layout() {
  const { session, cartCount, signOut, toast, setToast } = useAppStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userName = session?.user?.name || session?.admin?.name || "Guest";
  const userEmail = session?.user?.email || session?.admin?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) {
        return;
      }

      setMenuOpen(false);
    };

    window.addEventListener("pointerdown", handleOutside);
    return () => window.removeEventListener("pointerdown", handleOutside);
  }, []);

  return (
    <div className="app-frame">
      <header className="site-header">
        <div>
          <div className="brand-row">
            <h1>Fashion Tech Riders</h1>
            <span className="status-dot" />
          </div>
          <p className="brand-subtitle">
            All in one fashion platform for all ages and styles.
          </p>
        </div>

        <div className="header-meta" ref={menuRef}>
          <div className="account-shortcuts">
            <NavLink to="/" className={({ isActive }) => `quick-link ${isActive ? "active" : ""}`}>
              Home
            </NavLink>
            <NavLink to="/auth/signup" className={({ isActive }) => `quick-link ${isActive ? "active" : ""}`}>
              Sign up
            </NavLink>
            <NavLink to="/auth/login" className={({ isActive }) => `quick-link ${isActive ? "active" : ""}`}>
              Login
            </NavLink>
            <button
              type="button"
              className="avatar-btn"
              aria-label="Open account menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {userInitial}
            </button>
          </div>

          {menuOpen ? (
            <div className="account-menu card-glass">
              <div className="account-heading">
                <strong>{userName}</strong>
                <span>{userEmail || roleLabel(session)}</span>
              </div>
              <div className="account-grid">
                <NavLink to="/cart" className="menu-link" onClick={() => setMenuOpen(false)}>
                  Cart details: {cartCount} item(s)
                </NavLink>
                <NavLink to="/orders" className="menu-link" onClick={() => setMenuOpen(false)}>
                  Orders and bookings
                </NavLink>
                <NavLink to="/shop" className="menu-link" onClick={() => setMenuOpen(false)}>
                  Continue shopping
                </NavLink>
                {session?.role === "admin" ? (
                  <NavLink to="/admin/dashboard" className="menu-link" onClick={() => setMenuOpen(false)}>
                    Admin dashboard
                  </NavLink>
                ) : null}
              </div>
              {session ? (
                <button
                  type="button"
                  className="secondary-btn full-width"
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

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
