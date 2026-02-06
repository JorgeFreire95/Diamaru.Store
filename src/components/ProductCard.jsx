import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-img" />
        ) : product.type === 'book' ? (
          <div className="book-placeholder">📖</div>
        ) : (
          <div className="painting-placeholder">🖼️</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-type">{product.type === 'book' ? 'Libro' : 'Cuadro'}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => onAddToCart(product)}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
