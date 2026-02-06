import './ProductList.css'

function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>📦 No hay productos aún</p>
        <p>Crea tu primer producto para comenzar</p>
      </div>
    )
  }

  return (
    <div className="product-list">
      <h2>📦 Lista de Productos ({products.length})</h2>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="id-cell">#{product.id}</td>
                <td className="image-cell">
                  <img src={product.image_url} alt={product.name} />
                </td>
                <td className="title-cell">{product.name}</td>
                <td className="category-cell">
                  <span className={`badge badge-${product.type}`}>
                    {product.type === 'painting' ? '🖼️ Cuadro' : '📚 Libro'}
                  </span>
                </td>
                <td className="price-cell">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price)}
                </td>
                <td className="description-cell">
                  {product.description.substring(0, 50)}...
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(product)}
                    className="btn-small btn-edit"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="btn-small btn-delete"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductList
