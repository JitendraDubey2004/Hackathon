import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAppStore } from "../context/AppStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, setToast, session } = useAppStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: api.loginAdmin,
    onSuccess: (data) => {
      signIn({ role: "admin", token: data.token, admin: data.admin });
      setToast({ type: "success", message: "Admin login successful." });
      navigate("/admin/dashboard", { replace: true });
    }
  });

  if (session?.role === "admin") {
    return <div className="empty-page card-glass">Admin already signed in. Go to <a href="/admin/dashboard">dashboard</a>.</div>;
  }

  return (
    <section className="auth-shell admin-shell">
      <div className="auth-hero card-glass">
        <p className="eyebrow">Admin access</p>
        <h2>Manage catalog, stock, and bookings</h2>
        <p>Secure admin entry for category creation, product maintenance, and order monitoring.</p>
      </div>

      <form
        className="auth-form card-glass"
        onSubmit={(event) => {
          event.preventDefault();
          loginMutation.mutate(form);
        }}
      >
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} placeholder="admin@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} placeholder="••••••••" />
        </label>
        <button type="submit" className="primary-btn full-width" disabled={loginMutation.isPending}>
          Login admin
        </button>
      </form>
    </section>
  );
}
