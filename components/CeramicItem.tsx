"use client";

import { useState } from "react";
import { render } from "storyblok-rich-text-react-renderer";
import { addToCart } from "@/lib/cart-storage";

export default function CeramicItem({
  story,
  isRedisSold = false,
}: {
  story: any;
  isRedisSold?: boolean;
}) {
  const c = story?.content ?? {};

  const title = c.name || story?.name || "Product";
  const priceRaw = c.price_pln;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : typeof priceRaw === "string"
        ? Number(priceRaw.replace(",", "."))
        : null;

  const photos = c.photos || [];
  const available = c.status !== false && !isRedisSold; // false = sold
  const categories = Array.isArray(c.category) ? c.category : [];

  const main = photos?.[0]?.filename;
  const rest = photos?.slice(1) ?? [];
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const rawSlug = story?.slug ?? story?.full_slug ?? title;
  const productSlug =
    typeof rawSlug === "string"
      ? rawSlug.split("/").filter(Boolean).pop() ?? rawSlug
      : title;

  const handleCheckout = async () => {
    if (!available || price == null || Number.isNaN(price)) return;

    setIsLoading(true);
    setErrorMessage(null);
    setAddedMessage(null);

    try {
      const response = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productSlug,
              productName: title,
              pricePLN: price,
            },
          ],
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

  const handleAddToCart = () => {
    if (!available || price == null || Number.isNaN(price)) return;
    addToCart({
      productSlug,
      productName: title,
      pricePLN: price,
      photo: main,
    });
    setAddedMessage("Added to cart.");
    setErrorMessage(null);
  };

  return (
    <main className="page-shell" style={{ paddingTop: 32 }}>
      {/* Header */}
      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <h1 className="section-title" style={{ lineHeight: 1.1 }}>
          {title}
        </h1>

        <div className="detail-meta">
          {price != null && !Number.isNaN(price) && (
            <div style={{ fontSize: 18 }}>{price} PLN</div>
          )}

          {!available && <span className="pill badge-sold">Sold</span>}
        </div>

        {categories.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((cat: string) => (
              <span key={cat} className="pill">
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main layout: gallery + description */}
      <div className="detail-grid">
        {/* Gallery */}
        <section className="detail-gallery" style={{ display: "grid", gap: 12 }}>
          {main && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={main} alt={photos?.[0]?.alt || ""} style={{ height: 520 }} />
          )}

          {rest.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 10,
              }}
            >
              {rest.map((p: any) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id || p.filename}
                  src={p.filename}
                  alt={p.alt || ""}
                  style={{ height: 140 }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Description */}
        <aside className="detail-card">
          <h2 style={{ margin: 0, marginBottom: 10, fontSize: 18 }}>Details</h2>

          <div style={{ fontSize: 16, lineHeight: 1.7 }}>
            {c.description ? render(c.description) : <p>(No description yet.)</p>}
          </div>

          {/* Purchase actions */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gap: 10 }}>
              <button
                disabled={!available || isLoading}
                onClick={handleCheckout}
                className="button button-primary"
                style={{ width: "100%" }}
              >
                {available ? (isLoading ? "Redirecting..." : "Buy now") : "Sold"}
              </button>
              <button
                disabled={!available}
                onClick={handleAddToCart}
                className="button button-outline"
                style={{ width: "100%" }}
              >
                Add to cart
              </button>
            </div>
            {addedMessage && (
              <p style={{ marginTop: 12, color: "var(--sage-deep)", fontWeight: 600 }}>
                {addedMessage}{" "}
                <a href="/cart" style={{ color: "var(--sage-deep)" }}>
                  View cart
                </a>
              </p>
            )}
            {errorMessage && (
              <p style={{ marginTop: 12, color: "#a1422d", fontWeight: 600 }}>
                {errorMessage}
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
