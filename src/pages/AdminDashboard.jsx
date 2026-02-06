import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProductForm from '../components/admin/ProductForm'
import ProductList from '../components/admin/ProductList'
import AdminStats from '../components/admin/AdminStats'
import './AdminDashboard.css'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list')
  const [editingProduct, setEditingProduct] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('admin_token')
  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
    } else {
      fetchData()
    }
  }, [token, navigate])

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }

      const [productsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8000/admin/products', { headers }),
        axios.get('http://localhost:8000/admin/stats', { headers })
      ])

      setProducts(productsRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token')
        navigate('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      const headers = { Authorization: `Bearer ${token}` }

      if (editingProduct) {
        await axios.put(
          `http://localhost:8000/admin/products/${editingProduct.id}`,
          productData,
          { headers }
        )
      } else {
        await axios.post(
          'http://localhost:8000/admin/products',
          productData,
          { headers }
        )
      }

      setEditingProduct(null)
      setActiveTab('list')
      fetchData()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        await axios.delete(`http://localhost:8000/admin/products/${id}`, { headers })
        fetchData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setActiveTab('form')
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/')
  }

  if (loading) {
    return <div className="admin-dashboard loading">Cargando...</div>
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>🎨 Panel de Administración</h1>
            <p>Bienvenido, <strong>{admin.username}</strong></p>
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {stats && <AdminStats stats={stats} />}

      <div className="admin-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('list')
              setEditingProduct(null)
            }}
          >
            📦 Productos ({products.length})
          </button>
          <button
            className={`tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            {editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'list' && (
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}

          {activeTab === 'form' && (
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setEditingProduct(null)
                setActiveTab('list')
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
