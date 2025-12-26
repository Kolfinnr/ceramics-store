export default function CheckoutCancelPage() {
  return (
    <main className="page-shell" style={{ maxWidth: 720 }}>
      <h1 className="section-title" style={{ marginBottom: 12 }}>
        Checkout canceled
      </h1>
      <p style={{ fontSize: 18 }} className="muted">
        Your payment was not completed. If you still want the item, you can try again.
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
