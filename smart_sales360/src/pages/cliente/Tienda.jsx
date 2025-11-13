import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productosData from '../../data/productos';
import './Tienda.css';

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [ordenar, setOrdenar] = useState('relevancia');

  // Usar datos centralizados
  const productosMock = productosData.map(p => ({
    ...p,
    precioAnterior: p.precioAnterior
  }));
  
  // Backup original (comentado)
  const productosMockOriginal = [
    {
      id: 1,
      nombre: 'Laptop HP Pavilion 15"',
      precio: 4500,
      precioAnterior: 5200,
      imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      categoria: 'Computación',
      stock: 15,
      descuento: 13
    },
    {
      id: 2,
      nombre: 'Mouse Logitech MX Master',
      precio: 350,
      imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      categoria: 'Computación',
      stock: 50
    },
    {
      id: 3,
      nombre: 'Teclado Mecánico RGB Gaming',
      precio: 580,
      precioAnterior: 720,
      imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
      categoria: 'Computación',
      stock: 25,
      descuento: 19
    },
    {
      id: 4,
      nombre: 'Monitor LG UltraWide 27"',
      precio: 1850,
      imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
      categoria: 'Computación',
      stock: 10
    },
    {
      id: 5,
      nombre: 'Webcam Logitech HD 1080p',
      precio: 420,
      precioAnterior: 550,
      imagen: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop',
      categoria: 'Computación',
      stock: 30,
      descuento: 24
    },
    {
      id: 6,
      nombre: 'Auriculares Sony WH-1000XM4',
      precio: 890,
      precioAnterior: 1100,
      imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      categoria: 'Audio y Video',
      stock: 20,
      descuento: 19
    },
    {
      id: 7,
      nombre: 'Refrigeradora Samsung 18 pies',
      precio: 3200,
      precioAnterior: 3800,
      imagen: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
      categoria: 'Electrodomésticos',
      stock: 8,
      descuento: 16
    },
    {
      id: 8,
      nombre: 'Microondas LG 1.5 cu ft',
      precio: 680,
      imagen: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',
      categoria: 'Electrodomésticos',
      stock: 15
    },
    {
      id: 9,
      nombre: 'Lavadora Whirlpool 18kg',
      precio: 2850,
      imagen: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
      categoria: 'Electrodomésticos',
      stock: 12
    },
    {
      id: 10,
      nombre: 'Smart TV Samsung 55" 4K',
      precio: 3500,
      precioAnterior: 4200,
      imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      categoria: 'Audio y Video',
      stock: 18,
      descuento: 17
    },
    {
      id: 11,
      nombre: 'Licuadora Oster 600W',
      precio: 320,
      imagen: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
      categoria: 'Electrodomésticos',
      stock: 35
    },
    {
      id: 12,
      nombre: 'Smartphone Samsung Galaxy S23',
      precio: 4800,
      precioAnterior: 5500,
      imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      categoria: 'Telefonía',
      stock: 22,
      descuento: 13
    }
  ];

  useEffect(() => {
    // TODO: Conectar con backend
    setTimeout(() => {
      setProductos(productosMock);
      setLoading(false);
    }, 500);
  }, []);

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

      {/* Filtros y Ordenamiento */}
      <div className="tienda-toolbar">
        <div className="toolbar-left">
          <span className="productos-count">{productos.length} productos</span>
        </div>
        <div className="toolbar-right">
          <select 
            className="filter-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todas las categorías</option>
            <option value="Computación">Computación</option>
            <option value="Electrodomésticos">Electrodomésticos</option>
            <option value="Audio y Video">Audio y Video</option>
            <option value="Telefonía">Telefonía</option>
          </select>
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
        {productos.map((producto) => (
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
        ))}
      </div>
    </div>
  );
}

export default Tienda;
