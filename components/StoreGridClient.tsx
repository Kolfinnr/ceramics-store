"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function StoreGridClient({ products }: { products: any[] }) {
  const [showSold, setShowSold] = useState(false);
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const cats = p?.content?.category;
      if (Array.isArray(cats)) cats.forEach((c: string) => set.add(c));
    }
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const available = p?.content?.status !== false;
      const cats = Array.isArray(p?.content?.category) ? p.content.category : [];

      if (!showSold && !available) return false;
      if (category !== "all" && !cats.includes(category)) return false;

      return true;
    });
  }, [products, showSold, category]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* Controls */}
      <div className="filter-bar">
        <label className="filter-label">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All" : c}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-label">
          <input
            type="checkbox"
            checked={showSold}
            onChange={(e) => setShowSold(e.target.checked)}
          />
          <span>Show sold</span>
        </label>

        <div style={{ marginLeft: "auto" }} className="muted">
          Showing <strong>{filtered.length}</strong> item(s)
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {filtered.map((p: any) => (
          <ProductCard
            key={p.uuid}
            product={{
              name: p.name,
              slug: p.slug,
              content: p.content,
            }}
          />
        ))}
      </div>
    </div>
  );
}
