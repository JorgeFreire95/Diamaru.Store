import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar({ cartCount }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          <span>🎨📚</span>
          Diamaru Store
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Productos</Link></li>
          <li><Link to="/cart" className="cart-link" onClick={() => setIsMenuOpen(false)}>
            🛒 Carrito <span className="cart-count">{cartCount}</span>
          </Link></li>
          <li><Link to="/admin/login" className="admin-link" onClick={() => setIsMenuOpen(false)}>🔐 Admin</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
