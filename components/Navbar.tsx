import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand" aria-label="Rang E Renju home">
          <span className="navbar-brand-title">Rang E Renju</span>
          <span className="navbar-brand-sub">Handpicked Indian Textiles</span>
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link href="/shop" className="navbar-link" id="nav-shop">
              Shop
            </Link>
          </li>
          <li>
            <Link href="/shop#search" className="navbar-link" id="nav-instagram">
              Shop From Instagram
            </Link>
          </li>
          <li>
            <Link href="/track" className="navbar-link" id="nav-track">
              Track Order
            </Link>
          </li>
        </ul>

        <Link href="/shop" className="btn btn-primary btn-sm" id="nav-shop-btn">
          Shop Now
        </Link>
      </div>
    </nav>
  )
}
