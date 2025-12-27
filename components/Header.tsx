import CartLink from "./CartLink";
import LogoMark from "./LogoMark";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="logo">
          <LogoMark />
          <span className="logo-text">
            Fajna <span>Ceramika</span>
          </span>
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
          <CartLink className="nav-link cart-link" />
        </nav>
      </div>
    </header>
  );
}
