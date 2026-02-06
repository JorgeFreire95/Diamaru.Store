import './AdminStats.css'

function AdminStats({ stats }) {
  return (
    <div className="admin-stats">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-info">
          <p className="stat-label">Productos Totales</p>
          <p className="stat-value">{stats.total_products}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🖼️</div>
        <div className="stat-info">
          <p className="stat-label">Cuadros</p>
          <p className="stat-value">{stats.total_paintings}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📚</div>
        <div className="stat-info">
          <p className="stat-label">Libros PDF</p>
          <p className="stat-value">{stats.total_books}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👤</div>
        <div className="stat-info">
          <p className="stat-label">Administrador</p>
          <p className="stat-value">{stats.admin_username}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminStats
