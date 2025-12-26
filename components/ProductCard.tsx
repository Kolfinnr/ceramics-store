export default function ProductCard({ product }: { product: any }) {
  const { slug, content } = product;

  const title = content?.name || product?.name || "Product";
  const price = content?.price_pln;
  const photos = content?.photos || [];
  const img = photos?.[0]?.filename;

  // status: true = available, false = sold
  const available = content?.status !== false;

  return (
    <a
      href={`/store/${slug}`}
      className="card product-card"
      style={{ opacity: available ? 1 : 0.7 }}
    >
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={photos?.[0]?.alt || ""}
          className="product-image"
        />
      )}

      <div style={{ padding: "14px 16px", display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>

        {typeof price === "number" && (
          <div className="muted">{price} PLN</div>
        )}

        {!available && (
          <div className="pill badge-sold" style={{ width: "fit-content" }}>
            Sold
          </div>
        )}
      </div>
    </a>
  );
}
