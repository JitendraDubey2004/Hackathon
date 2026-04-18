import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SESSION_KEY = "fashion-portal-session";
const CART_KEY = "fashion-portal-cart";

const AppStoreContext = createContext(null);

function readStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppStoreProvider({ children }) {
  const [session, setSession] = useState(() => readStoredJson(SESSION_KEY, null));
  const [cart, setCart] = useState(() => readStoredJson(CART_KEY, []));
  const [toast, setToast] = useState(null);

  useEffect(() => writeStoredJson(SESSION_KEY, session), [session]);
  useEffect(() => writeStoredJson(CART_KEY, cart), [cart]);

  const signIn = (nextSession) => {
    setSession(nextSession);
  };

  const signOut = () => {
    setSession(null);
    setToast({ type: "success", message: "Logged out successfully." });
  };

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          title: product.title,
          cost: product.cost,
          taxPercent: product.taxPercent,
          imageUrl: product.imageUrl,
          quantity: 1
        }
      ];
    });

    setToast({ type: "success", message: `${product.title} added to cart.` });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    setCart((current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const value = {
    session,
    setSession: signIn,
    signIn,
    signOut,
    cart,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toast,
    setToast
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }

  return context;
}
