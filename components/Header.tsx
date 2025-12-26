import CartLink from "./CartLink";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="logo">
          CERAMICS
        </a>

        <nav className="nav">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/store" className="nav-link">
            Store
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
          <CartLink className="nav-link" />
        </nav>
      </div>
    </header>
  );
}
