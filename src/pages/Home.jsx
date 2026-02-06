import { useEffect, useState } from 'react'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a Diamaru Store</h1>
          <p>Descubre nuestra colección exclusiva de cuadros y libros digitales</p>
          <a href="/products" className="btn btn-primary">
            Ver productos
          </a>
        </div>
        <div className="hero-emoji">🎨📚</div>
      </section>

      <section className="features container">
        <div className="feature-card">
          <span className="feature-icon">🎨</span>
          <h3>Cuadros Únicos</h3>
          <p>Colección seleccionada de obras de arte de artistas destacados</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📖</span>
          <h3>Libros</h3>
          <p>Miles de títulos en formato PDF disponibles instantáneamente</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💳</span>
          <h3>Compra Segura</h3>
          <p>Transacciones seguras con múltiples métodos de pago</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Entrega Rápida</h3>
          <p>Acceso inmediato a tus compras digitales</p>
        </div>
      </section>
    </main>
  )
}

export default Home
