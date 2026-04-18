import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAppStore } from "../context/AppStore";

const defaultForm = { name: "", email: "", password: "" };

export default function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, setToast, session } = useAppStore();
  const [form, setForm] = useState(defaultForm);

  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/shop";
  const isSignup = mode === "signup";

  const userMutation = useMutation({
    mutationFn: isSignup ? api.signupUser : api.loginUser,
    onSuccess: (data) => {
      signIn({ role: "user", token: data.token, user: data.user });
      setToast({ type: "success", message: isSignup ? "Account created successfully." : "Welcome back." });
      navigate(redirectTo, { replace: true });
    }
  });

  if (session?.role === "user") {
    return <div className="empty-page card-glass">You are already signed in. Go to <Link to="/shop">shop</Link>.</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    userMutation.mutate(form);
  };

  return (
    <section className="auth-shell">
      <div className="auth-hero card-glass">
        <p className="eyebrow">{isSignup ? "Create account" : "Sign in"}</p>
        <h2>{isSignup ? "Join the fashion edit" : "Welcome back to your closet"}</h2>
        <p>
          Save your cart, place bookings, and keep your order history synced to your account.
        </p>
      </div>

      <form className="auth-form card-glass" onSubmit={handleSubmit}>
        {isSignup ? (
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} placeholder="Full name" />
          </label>
        ) : null}
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} placeholder="••••••••" />
        </label>
        <button type="submit" className="primary-btn full-width" disabled={userMutation.isPending}>
          {isSignup ? "Create account" : "Login"}
        </button>
        <p className="switch-link">
          {isSignup ? (
            <Link to="/auth/login">Already have an account? Login</Link>
          ) : (
            <Link to="/auth/signup">New here? Sign up</Link>
          )}
        </p>
      </form>
    </section>
  );
}
