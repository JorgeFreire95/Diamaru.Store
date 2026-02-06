import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/api'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
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

      const orderData = {
        customer: formData,
        items: cart,
        total: total * 1.16,
        status: 'completed',
      }

      await orderService.createOrder(orderData)
      
      localStorage.removeItem('cart')
      alert('¡Compra realizada exitosamente!')
      navigate('/')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar la compra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Información Personal</h2>
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

            <h2>Dirección de Envío</h2>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
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
                placeholder="Código Postal"
                required
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>

            <h2>Información de Pago</h2>
            <input
              type="text"
              name="cardNumber"
              placeholder="Número de Tarjeta"
              required
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="16"
            />

            <div className="form-row">
              <input
                type="text"
                name="cardExpiry"
                placeholder="MM/YY"
                required
                value={formData.cardExpiry}
                onChange={handleChange}
                maxLength="5"
              />
              <input
                type="text"
                name="cardCVC"
                placeholder="CVC"
                required
                value={formData.cardCVC}
                onChange={handleChange}
                maxLength="3"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Completar Compra'}
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
