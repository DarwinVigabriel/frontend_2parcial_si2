import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ClienteLayout.css';

function ClienteLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [cartCount] = useState(3); // TODO: Conectar con estado real del carrito
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => {
    if (path === '/tienda') {
      return location.pathname === '/tienda';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="cliente-layout">
      {/* Header */}
      <header className="cliente-header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/tienda" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="#8B1E2D"/>
                <path d="M35 45 L45 55 L65 35" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 60 L40 60 L42 70 L58 70 L60 60 L70 60" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="42" cy="75" r="3" fill="white"/>
                <circle cx="58" cy="75" r="3" fill="white"/>
              </svg>
            </div>
            <span className="logo-text">Smart Sales<span className="logo-365">365</span></span>
          </Link>

          {/* Buscador */}
          <div className="header-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="Buscar productos..."
            />
          </div>
        </div>

        {/* Navegación con Carrito y Usuario */}
        <nav className="cliente-nav">
          <div className="nav-links">
            <Link 
              to="/tienda" 
              className={`nav-link ${isActive('/tienda') && location.pathname === '/tienda' ? 'active' : ''}`}
            >
              Todos los Productos
            </Link>
            <Link 
              to="/tienda/categorias/computacion" 
              className={`nav-link ${isActive('/tienda/categorias/computacion') ? 'active' : ''}`}
            >
              Computación
            </Link>
            <Link 
              to="/tienda/categorias/electrodomesticos" 
              className={`nav-link ${isActive('/tienda/categorias/electrodomesticos') ? 'active' : ''}`}
            >
              Electrodomésticos
            </Link>
            <Link 
              to="/tienda/categorias/audio-video" 
              className={`nav-link ${isActive('/tienda/categorias/audio-video') ? 'active' : ''}`}
            >
              Audio y Video
            </Link>
            <Link 
              to="/tienda/categorias/telefonia" 
              className={`nav-link ${isActive('/tienda/categorias/telefonia') ? 'active' : ''}`}
            >
              Telefonía
            </Link>
            <Link 
              to="/tienda/ofertas" 
              className={`nav-link ofertas ${isActive('/tienda/ofertas') ? 'active' : ''}`}
            >
              Ofertas
            </Link>
          </div>

          {/* Acciones en la navegación */}
          <div className="nav-actions">
            {/* Carrito */}
            <Link to="/tienda/carrito" className="nav-btn cart-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Usuario */}
            <div className="user-menu">
              <button 
                className="nav-btn user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/tienda/perfil" className="dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Mi Perfil
                  </Link>
                  <Link to="/tienda/pedidos" className="dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    Mis Pedidos
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Contenido */}
      <main className="cliente-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="cliente-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>Smart Sales 360</h4>
            <p>Tu tienda online de confianza</p>
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
          <p>&copy; 2024 Smart Sales 360. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default ClienteLayout;
