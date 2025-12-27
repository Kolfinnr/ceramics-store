"use client";

import { useEffect, useState } from "react";
import { readCart, subscribeToCartChanges } from "@/lib/cart-storage";

export default function CartLink({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readCart().length);
    update();
    return subscribeToCartChanges(update);
  }, []);

  return (
    <a href="/cart" className={className}>
      <span className="cart-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 5h2l2.5 11h9.5l2.2-8H7.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="19" r="1.7" />
          <circle cx="17" cy="19" r="1.7" />
        </svg>
      </span>
      Cart{count > 0 ? <span className="cart-count">{count}</span> : null}
    </a>
  );
}
