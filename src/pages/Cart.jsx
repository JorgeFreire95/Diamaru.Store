import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

function Cart({ setCartCount }) {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      setCart(JSON.parse(saved))
    }
  }, [])

  const handleRemoveItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCartCount(newCart.length)
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleWhatsAppCheckout = () => {
    // Número de teléfono para recibir los pedidos (formato internacional sin +)
    // CAMBIAR ESTE NÚMERO POR EL TUYO
    const phoneNumber = "56975333778"
    // const totalConImpuesto = total * 1.19

    let message = "Hola! 👋 Me gustaría realizar el siguiente pedido en Diamaru Store:\n\n"

    cart.forEach(item => {
      const precioFormato = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)
      message += `📦 *${item.quantity} x ${item.name}* (${precioFormato})\n`
    })

    message += `\n💰 *Total a pagar: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}*`
    message += `\n\nQuedo atento a los detalles de pago y envío. Gracias!`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h1>Tu carrito está vacío</h1>
            <p>Agrega algunos productos para comenzar</p>
            <Link to="/products" className="btn btn-primary">
              Ir a Productos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="container">
        <h1>Mi Carrito</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    item.type === 'book' ? '📖' : '🖼️'
                  )}
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-type">{item.type === 'book' ? 'Libro' : 'Cuadro'}</p>
                  <p className="item-price-mobile">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                  </p>
                </div>

                <div className="item-actions-container">
                  <p className="item-price-desktop">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                  </p>
                  <div className="item-quantity">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                    />
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price * item.quantity)}
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumen</h2>
            {/* 
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}</span>
            </div>
            */}
            <div className="summary-total">
              <span>Total:</span>
              <span>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate('/checkout')}
            >
              Completar Datos del Pedido
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cart
