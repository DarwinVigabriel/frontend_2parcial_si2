import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Carrito.css';

function Carrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      id: 1,
      nombre: 'Laptop HP Pavilion 15"',
      precio: 4500,
      cantidad: 1,
      imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      stock: 15
    },
    {
      id: 2,
      nombre: 'Mouse Logitech MX Master',
      precio: 350,
      cantidad: 2,
      imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      stock: 50
    },
    {
      id: 3,
      nombre: 'Teclado Mecánico RGB Gaming',
      precio: 580,
      cantidad: 1,
      imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
      stock: 25
    }
  ]);

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const eliminarItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const iva = subtotal * 0.13;
  const total = subtotal + iva;

  const handleCheckout = () => {
    // TODO: Implementar proceso de pago
    navigate('/tienda/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para comenzar tu compra</p>
          <Link to="/tienda" className="btn-volver">
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h1>Mi Carrito</h1>
        <span className="items-count">{items.length} productos</span>
      </div>

      <div className="carrito-content">
        {/* Lista de items */}
        <div className="carrito-items">
          {items.map((item) => (
            <div key={item.id} className="carrito-item">
              <img src={item.imagen} alt={item.nombre} className="item-imagen" />
              
              <div className="item-info">
                <Link to={`/tienda/producto/${item.id}`} className="item-nombre">
                  {item.nombre}
                </Link>
                <div className="item-precio">Bs. {item.precio.toFixed(2)}</div>
              </div>

              <div className="item-cantidad">
                <button 
                  className="cantidad-btn"
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                >
                  -
                </button>
                <span className="cantidad-valor">{item.cantidad}</span>
                <button 
                  className="cantidad-btn"
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                Bs. {(item.precio * item.cantidad).toFixed(2)}
              </div>

              <button 
                className="item-eliminar"
                onClick={() => eliminarItem(item.id)}
                title="Eliminar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="carrito-resumen">
          <h3>Resumen del Pedido</h3>
          
          <div className="resumen-linea">
            <span>Subtotal:</span>
            <span>Bs. {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="resumen-linea">
            <span>IVA (13%):</span>
            <span>Bs. {iva.toFixed(2)}</span>
          </div>
          
          <div className="resumen-linea total">
            <span>Total:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>

          <button className="btn-checkout" onClick={handleCheckout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Proceder al Pago
          </button>

          <Link to="/tienda" className="btn-seguir-comprando">
            Seguir Comprando
          </Link>

          <div className="resumen-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>Envío gratis en compras mayores a Bs. 500</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
