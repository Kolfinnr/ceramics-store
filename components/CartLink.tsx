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
      Cart{count > 0 ? ` (${count})` : ""}
    </a>
  );
}
