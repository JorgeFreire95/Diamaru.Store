import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productService } from '../services/api'
import './ProductDetail.css'

function ProductDetail({ setCartCount }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProductById(id)
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    setCartCount(cart.length)
    alert('Producto agregado al carrito!')
  }

  if (loading) return <main className="product-detail"><div>Cargando...</div></main>
  if (!product) return <main className="product-detail"><div>Producto no encontrado</div></main>

  return (
    <main className="product-detail">
      <div className="container">
        <div className="detail-grid">
          <div className="detail-image">
            {product.type === 'book' ? (
              <div className="detail-placeholder">📖</div>
            ) : (
              <div className="detail-placeholder">🖼️</div>
            )}
          </div>

          <div className="detail-info">
            <h1>{product.name}</h1>
            <p className="detail-type">
              {product.type === 'book' ? 'Libro PDF' : 'Cuadro'}
            </p>
            <p className="detail-description">{product.description}</p>

            <div className="detail-price">
              <span className="price">${product.price}</span>
            </div>

            {product.details && (
              <div className="detail-specs">
                <h3>Especificaciones</h3>
                <p>{product.details}</p>
              </div>
            )}

            <div className="detail-actions">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-input">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetail
