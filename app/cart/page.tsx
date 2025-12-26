import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <main className="page-shell" style={{ maxWidth: 900 }}>
      <h1 className="section-title" style={{ marginBottom: 18 }}>
        Your cart
      </h1>
      <CartView />
    </main>
  );
}
