import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/api'
import './Checkout.css'

function Checkout({ setCartCount }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  // Estado inicial sin datos de tarjeta
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      // 1. Guardar en Base de Datos
      const orderData = {
        customer: formData,
        items: cart,
        total: total, // Sin impuesto extra
        status: 'pending', // Estado pendiente hasta confirmar por WhatsApp/Pago
      }

      await orderService.createOrder(orderData)

      // 2. Generar mensaje de WhatsApp
      const phoneNumber = "56975333778"
      let message = `Hola! 👋 Quisiera confirmar mi pedido #${Math.floor(Math.random() * 10000)} en Diamaru Store.\n\n`
      message += `👤 *Cliente:* ${formData.firstName} ${formData.lastName}\n`
      message += `📍 *Dirección:* ${formData.address}, ${formData.city}\n`
      message += `📞 *Teléfono:* ${formData.phone}\n\n`
      message += `*Detalle del pedido:*\n`

      cart.forEach(item => {
        const precioFormato = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)
        message += `📦 ${item.quantity} x ${item.name} (${precioFormato})\n`
      })

      message += `\n💰 *Total a pagar: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}*`
      message += `\n\nQuedo atento para coordinar el pago y envío. Gracias!`

      // 3. Limpiar carrito y redirigir
      localStorage.removeItem('cart')
      setCartCount(0)

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      alert('¡Pedido registrado! Se abrirá WhatsApp para finalizar la coordinación.')
      navigate('/')

    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <h1>Finalizar Pedido</h1>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Datos de Envío y Contacto</h2>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="Nombre"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Apellido"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Dirección completa"
              required
              value={formData.address}
              onChange={handleChange}
            />

            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                required
                value={formData.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Código Postal (Opcional)"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-info-box" style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bae6fd' }}>
              <p style={{ margin: 0, color: '#0369a1', fontSize: '14px' }}>
                ℹ️ Al confirmar, se registrará tu pedido en nuestro sistema y <strong>se abrirá WhatsApp automáticamente</strong> para enviarnos los detalles y coordinar el pago.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block whatsapp-btn"
              disabled={loading}
              style={{ backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>📱</span> {loading ? 'Procesando...' : 'Confirmar y Abrir WhatsApp'}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Resumen del Pedido</h2>
            <p>Se procesará tu pago y recibirás acceso a tus productos digitales.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Checkout
