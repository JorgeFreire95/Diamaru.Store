import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>🎨📚</span>
          Diamaru Store
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/products">Productos</Link></li>
          <li><Link to="/cart" className="cart-link">
            🛒 Carrito <span className="cart-count">{cartCount}</span>
          </Link></li>
          <li><Link to="/admin/login" className="admin-link">🔐 Admin</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
