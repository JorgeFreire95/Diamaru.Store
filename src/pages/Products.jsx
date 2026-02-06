import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/api'
import './Products.css'

function Products({ setCartCount }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    let newCart

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]
    }

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCartCount(newCart.length)
    alert('Producto agregado al carrito!')
  }

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.type === filter)

  return (
    <main className="products-page">
      <div className="container">
        <h1>Nuestros Productos</h1>
        
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filter === 'painting' ? 'active' : ''}`}
            onClick={() => setFilter('painting')}
          >
            Cuadros
          </button>
          <button
            className={`filter-btn ${filter === 'book' ? 'active' : ''}`}
            onClick={() => setFilter('book')}
          >
            Libros PDF
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : (
          <div className="grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Products
