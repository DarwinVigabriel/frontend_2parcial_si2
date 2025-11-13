import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productosData from '../../data/productos';
import './Tienda.css';

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [ordenar, setOrdenar] = useState('relevancia');

  // Usar datos centralizados
  const productosMock = productosData;

  useEffect(() => {
    // TODO: Conectar con backend
    setTimeout(() => {
      setProductos(productosMock);
      setLoading(false);
    }, 500);
  }, []);

  // Filtrar productos por categoría
  const productosFiltrados = productos.filter(producto => {
    if (categoriaActiva === 'todos') return true;
    
    if (categoriaActiva === 'ofertas') {
      return producto.descuento && producto.descuento > 0;
    }

    // Mapear categorías de las pestañas a las categorías de productos
    const mapaCategorias = {
      'computacion': ['Computación', 'Periféricos', 'Monitores'],
      'electrodomesticos': ['Electrodomésticos', 'Climatización'],
      'audio': ['Audio', 'Audio y Video', 'Televisores'],
      'telefonia': ['Telefonía', 'Smart Home']
    };

    const categoriasPermitidas = mapaCategorias[categoriaActiva] || [];
    return categoriasPermitidas.includes(producto.categoria);
  });

  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenar) {
      case 'menor-precio':
        return a.precio - b.precio;
      case 'mayor-precio':
        return b.precio - a.precio;
      case 'descuento':
        return (b.descuento || 0) - (a.descuento || 0);
      default:
        return 0;
    }
  });

  const handleAddToCart = (producto) => {
    // TODO: Implementar agregar al carrito
    console.log('Agregar al carrito:', producto);
    alert(`${producto.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="tienda-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="tienda-container">
      {/* Banner */}
      <div className="tienda-banner">
        <div className="banner-content">
          <h1>Bienvenido a Smart Sales</h1>
          <p>Electrodomésticos y tecnología para tu hogar al mejor precio</p>
        </div>
      </div>

      {/* Pestañas de Categorías */}
      <div className="categorias-tabs">
        <button 
          className={`tab-btn ${categoriaActiva === 'todos' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('todos')}
        >
          Todos los Productos
        </button>
        <button 
          className={`tab-btn ${categoriaActiva === 'computacion' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('computacion')}
        >
          Computación
        </button>
        <button 
          className={`tab-btn ${categoriaActiva === 'electrodomesticos' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('electrodomesticos')}
        >
          Electrodomésticos
        </button>
        <button 
          className={`tab-btn ${categoriaActiva === 'audio' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('audio')}
        >
          Audio y Video
        </button>
        <button 
          className={`tab-btn ${categoriaActiva === 'telefonia' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('telefonia')}
        >
          Telefonía
        </button>
        <button 
          className={`tab-btn tab-ofertas ${categoriaActiva === 'ofertas' ? 'active' : ''}`}
          onClick={() => setCategoriaActiva('ofertas')}
        >
          🔥 Ofertas
        </button>
      </div>

      {/* Filtros y Ordenamiento */}
      <div className="tienda-toolbar">
        <div className="toolbar-left">
          <span className="productos-count">
            {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''}
            {categoriaActiva !== 'todos' && ` en ${
              categoriaActiva === 'computacion' ? 'Computación' :
              categoriaActiva === 'electrodomesticos' ? 'Electrodomésticos' :
              categoriaActiva === 'audio' ? 'Audio y Video' :
              categoriaActiva === 'telefonia' ? 'Telefonía' :
              'Ofertas'
            }`}
          </span>
        </div>
        <div className="toolbar-right">
          <select 
            className="filter-select"
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
          >
            <option value="relevancia">Más relevantes</option>
            <option value="menor-precio">Menor precio</option>
            <option value="mayor-precio">Mayor precio</option>
            <option value="descuento">Mayor descuento</option>
          </select>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="productos-grid">
        {productosOrdenados.length === 0 ? (
          <div className="no-productos">
            <p>No hay productos en esta categoría</p>
          </div>
        ) : (
          productosOrdenados.map((producto) => (
          <div key={producto.id} className="producto-card">
            {/* Badge de descuento */}
            {producto.descuento && (
              <div className="descuento-badge">-{producto.descuento}%</div>
            )}

            {/* Imagen */}
            <Link to={`/tienda/producto/${producto.id}`} className="producto-imagen">
              <img src={producto.imagen} alt={producto.nombre} />
            </Link>

            {/* Info */}
            <div className="producto-info">
              <span className="producto-categoria">{producto.categoria}</span>
              <Link to={`/tienda/producto/${producto.id}`} className="producto-nombre">
                {producto.nombre}
              </Link>
              
              {/* Precio */}
              <div className="producto-precio">
                <span className="precio-actual">Bs. {producto.precio.toFixed(2)}</span>
                {producto.precioAnterior && (
                  <span className="precio-anterior">Bs. {producto.precioAnterior.toFixed(2)}</span>
                )}
              </div>

              {/* Stock */}
              <div className="producto-stock">
                {producto.stock > 0 ? (
                  <span className="stock-disponible">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Stock disponible ({producto.stock})
                  </span>
                ) : (
                  <span className="stock-agotado">Agotado</span>
                )}
              </div>

              {/* Botón */}
              <button 
                className="btn-agregar"
                onClick={() => handleAddToCart(producto)}
                disabled={producto.stock === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}

export default Tienda;
