"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-storage";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <main className="page-shell" style={{ maxWidth: 720 }}>
      <h1 className="section-title" style={{ marginBottom: 12 }}>
        Payment successful
      </h1>
      <p style={{ fontSize: 18 }} className="muted">
        Thank you! We have received your payment and are preparing your order.
      </p>
      <a
        href="/store"
        className="button button-outline"
        style={{ display: "inline-block", marginTop: 24 }}
      >
        Back to store
      </a>
    </main>
  );
}
