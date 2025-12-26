"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartItem,
  clearCart,
  readCart,
  removeFromCart,
  subscribeToCartChanges,
} from "@/lib/cart-storage";

export default function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setItems(readCart());
    return subscribeToCartChanges(() => setItems(readCart()));
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.pricePLN, 0);
  }, [items]);

  const handleRemove = (slug: string) => {
    setItems(removeFromCart(slug));
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productSlug: item.productSlug,
            productName: item.productName,
            pricePLN: item.pricePLN,
          })),
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setErrorMessage(data.error ?? "Unable to start checkout.");
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage("Unable to start checkout.");
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  return (
    <section style={{ display: "grid", gap: 18 }}>
      {items.length === 0 ? (
        <p style={{ fontSize: 18 }} className="muted">
          Your cart is empty. Browse the store to add items.
        </p>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <div key={item.productSlug} className="cart-item">
                {item.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.photo} alt={item.productName} />
                )}
                <div style={{ display: "grid", gap: 6 }}>
                  <strong>{item.productName}</strong>
                  <span className="muted">{item.pricePLN} PLN</span>
                  <a href={`/store/${item.productSlug}`} style={{ color: "#111" }}>
                    View item
                  </a>
                </div>
                <button
                  onClick={() => handleRemove(item.productSlug)}
                  className="button button-ghost"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div style={{ fontSize: 18 }}>
              Total: <strong>{total} PLN</strong>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="button button-primary"
              >
                {isLoading ? "Redirecting..." : "Checkout"}
              </button>
              <button
                onClick={handleClear}
                className="button button-outline"
              >
                Clear cart
              </button>
            </div>
            {errorMessage && (
              <p style={{ color: "#a1422d", fontWeight: 600 }}>{errorMessage}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
