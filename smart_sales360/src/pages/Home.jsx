import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [productosDestacados, setProductosDestacados] = useState([]);

  // Productos destacados (los mismos de la tienda)
  const productos = [
    {
      id: 1,
      nombre: 'Laptop HP Pavilion 15"',
      precio: 4500,
      precioAnterior: 5200,
      imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      descuento: 13
    },
    {
      id: 7,
      nombre: 'Refrigeradora Samsung 18 pies',
      precio: 3200,
      precioAnterior: 3800,
      imagen: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
      descuento: 16
    },
    {
      id: 10,
      nombre: 'Smart TV Samsung 55" 4K',
      precio: 3500,
      precioAnterior: 4200,
      imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      descuento: 17
    },
    {
      id: 12,
      nombre: 'Smartphone Samsung Galaxy S23',
      precio: 4800,
      precioAnterior: 5500,
      imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      descuento: 13
    }
  ];

  useEffect(() => {
    setProductosDestacados(productos);
  }, []);

  const categorias = [
    {
      nombre: 'Computación',
      imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
      descripcion: 'Laptops, teclados, mouse y más'
    },
    {
      nombre: 'Electrodomésticos',
      imagen: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
      descripcion: 'Para tu hogar y cocina'
    },
    {
      nombre: 'Audio y Video',
      imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      descripcion: 'TVs, auriculares y más'
    },
    {
      nombre: 'Telefonía',
      imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      descripcion: 'Smartphones y accesorios'
    }
  ];

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="home-navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="#8B1E2D"/>
                <path d="M35 45 L45 55 L65 35" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 60 L40 60 L42 70 L58 70 L60 60 L70 60" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="42" cy="75" r="3" fill="white"/>
                <circle cx="58" cy="75" r="3" fill="white"/>
              </svg>
            </div>
            <span className="navbar-title">Smart Sales<span className="title-365">365</span></span>
          </Link>
          <div className="navbar-actions">
            <Link to="/" className="nav-btn">Inicio</Link>
            <Link to="/login" className="nav-btn secondary">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Electrodomésticos y Tecnología
            <span className="hero-highlight"> al Mejor Precio</span>
          </h1>
          <p className="hero-subtitle">
            Encuentra todo lo que necesitas para tu hogar y oficina con las mejores ofertas del mercado
          </p>
          <div className="hero-buttons">
            <Link to="/tienda" className="btn-primary">
              Ver Productos
            </Link>
            <Link to="/login" className="btn-secondary">
              Crear Cuenta
            </Link>
          </div>
          <div className="hero-features">
            <div className="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <span>Envío Gratis</span>
            </div>
            <div className="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Compra Segura</span>
            </div>
            <div className="feature">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Entrega Rápida</span>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="productos-section">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Las mejores ofertas de la semana</p>
        </div>
        <div className="productos-grid">
          {productosDestacados.map((producto) => (
            <div key={producto.id} className="producto-card">
              {producto.descuento && (
                <div className="descuento-badge">-{producto.descuento}%</div>
              )}
              <div className="producto-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
              <div className="producto-info">
                <h3>{producto.nombre}</h3>
                <div className="producto-precio">
                  <span className="precio-actual">Bs. {producto.precio.toFixed(2)}</span>
                  {producto.precioAnterior && (
                    <span className="precio-anterior">Bs. {producto.precioAnterior.toFixed(2)}</span>
                  )}
                </div>
                <Link to="/tienda" className="btn-ver-mas">
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <Link to="/tienda" className="btn-ver-todos">
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="categorias-section">
        <div className="section-header">
          <h2>Explora por Categorías</h2>
          <p>Encuentra lo que buscas más rápido</p>
        </div>
        <div className="categorias-grid">
          {categorias.map((categoria, index) => (
            <Link to="/tienda" key={index} className="categoria-card">
              <div className="categoria-imagen">
                <img src={categoria.imagen} alt={categoria.nombre} />
                <div className="categoria-overlay">
                  <h3>{categoria.nombre}</h3>
                  <p>{categoria.descripcion}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para Comprar?</h2>
          <p>Regístrate ahora y obtén un 10% de descuento en tu primera compra</p>
          <Link to="/login" className="btn-cta">
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Smart Sales 365</h4>
            <p>Tu tienda de electrodomésticos y tecnología de confianza</p>
          </div>
          <div className="footer-section">
            <h4>Ayuda</h4>
            <a href="#">Preguntas Frecuentes</a>
            <a href="#">Envíos</a>
            <a href="#">Devoluciones</a>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <a href="#">contacto@smartsales.com</a>
            <a href="#">+591 70123456</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Smart Sales 365. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
