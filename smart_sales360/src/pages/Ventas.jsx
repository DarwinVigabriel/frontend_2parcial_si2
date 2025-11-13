import { useState, useEffect } from 'react';
import { productosAPI, clientesAPI, ventasAPI } from '../services/api';
import { imprimirComprobante, downloadPDF, generarNombreArchivoPDF } from '../utils/pdfGenerator';
import { exportVentasToCSV, exportVentasToExcel, generateFilename } from '../utils/exportUtils';
import NuevoClienteModal from '../components/NuevoClienteModal';
import './Ventas.css';

const Ventas = () => {
  const [activeTab, setActiveTab] = useState('nueva'); // 'nueva' o 'historial'
  const [carrito, setCarrito] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);
  const [showNuevoClienteModal, setShowNuevoClienteModal] = useState(false);
  
  // Estados para datos
  const [loading, setLoading] = useState(false);
  const [stockWarnings, setStockWarnings] = useState({});
  
  // Estados para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    metodoPago: ''
  });

  // Datos mock
  const productosMock = [
    { id: 1, nombre: 'Laptop HP Pavilion', precio: 1299, stock: 15, codigo: 'LAP001', categoria: 'Laptops' },
    { id: 2, nombre: 'Mouse Logitech MX', precio: 45, stock: 50, codigo: 'MOU001', categoria: 'Accesorios' },
    { id: 3, nombre: 'Teclado Mecánico RGB', precio: 120, stock: 30, codigo: 'TEC001', categoria: 'Accesorios' },
    { id: 4, nombre: 'Monitor Samsung 27"', precio: 350, stock: 20, codigo: 'MON001', categoria: 'Monitores' },
    { id: 5, nombre: 'Webcam HD Logitech', precio: 89, stock: 25, codigo: 'WEB001', categoria: 'Accesorios' },
  ];

  const clientesMock = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '555-0001', nit: '1234567' },
    { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '555-0002', nit: '7654321' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555-0003', nit: '9876543' },
  ];

  const ventasMock = [
    { id: 1, fecha: '2024-11-13 14:30', cliente: 'Juan Pérez', total: 1299, items: 2, estado: 'completado', metodoPago: 'tarjeta' },
    { id: 2, fecha: '2024-11-13 12:15', cliente: 'María García', total: 45, items: 1, estado: 'completado', metodoPago: 'efectivo' },
    { id: 3, fecha: '2024-11-12 16:45', cliente: 'Carlos López', total: 120, items: 1, estado: 'pendiente', metodoPago: 'transferencia' },
    { id: 4, fecha: '2024-11-12 10:20', cliente: 'Ana Martínez', total: 350, items: 1, estado: 'completado', metodoPago: 'paypal' },
  ];

  // Estados para datos de API
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventasHistorial, setVentasHistorial] = useState([]);

  // Búsqueda de productos con debounce
  useEffect(() => {
    const buscarProductos = async () => {
      if (!busquedaProducto || busquedaProducto.length < 2) {
        setProductosDisponibles([]);
        return;
      }

      try {
        const data = await productosAPI.search(busquedaProducto);
        // Django REST Framework devuelve array directamente o con results
        const productosList = Array.isArray(data) ? data : data.results || [];
        
        // Adaptar campos del backend al frontend
        const productosAdaptados = productosList.map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio_venta,
          precio_venta: p.precio_venta,
          stock: p.stock_actual,
          stock_actual: p.stock_actual,
          codigo: p.sku || p.codigo_barras,
          sku: p.sku,
          codigo_barras: p.codigo_barras,
          categoria: p.categoria
        }));
        
        setProductosDisponibles(productosAdaptados);
      } catch (err) {
        console.error('Error buscando productos:', err);
        // Fallback a datos mock
        setProductosDisponibles(productosMock.filter(p =>
          p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
          p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase())
        ));
      }
    };

    const timer = setTimeout(buscarProductos, 300);
    return () => clearTimeout(timer);
  }, [busquedaProducto]);

  // Búsqueda de clientes con debounce
  useEffect(() => {
    const buscarClientes = async () => {
      if (!busquedaCliente || busquedaCliente.length < 2) {
        setClientes([]);
        return;
      }

      try {
        const data = await clientesAPI.search(busquedaCliente);
        const clientesList = Array.isArray(data) ? data : data.results || [];
        
        // Adaptar campos del backend al frontend
        const clientesAdaptados = clientesList.map(c => ({
          id: c.id,
          nombre: c.nombre_completo || c.nombre,
          email: c.email,
          telefono: c.telefono,
          nit: c.nit,
          direccion: c.direccion
        }));
        
        setClientes(clientesAdaptados);
      } catch (err) {
        console.error('Error buscando clientes:', err);
        // Fallback a datos mock
        setClientes(clientesMock.filter(c =>
          c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
          c.nit.includes(busquedaCliente)
        ));
      }
    };

    const timer = setTimeout(buscarClientes, 300);
    return () => clearTimeout(timer);
  }, [busquedaCliente]);

  // Cargar ventas cuando se cambia a tab historial
  useEffect(() => {
    const cargarVentas = async () => {
      if (activeTab !== 'historial') return;

      try {
        setLoading(true);
        const params = {
          page: currentPage,
          ...filtros
        };
        const data = await ventasAPI.getAll(params);
        setVentasHistorial(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error cargando ventas:', err);
        // Fallback a datos mock
        setVentasHistorial(ventasMock);
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, [activeTab, currentPage, filtros]);

  const productosFiltrados = productosDisponibles;
  const clientesFiltrados = clientes;

  // Funciones del carrito
  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    const nuevaCantidad = itemExistente ? itemExistente.cantidad + 1 : 1;
    
    // Validar stock
    if (nuevaCantidad > producto.stock) {
      setStockWarnings(prev => ({
        ...prev,
        [producto.id]: `Stock insuficiente. Disponible: ${producto.stock}`
      }));
      alert(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`);
      return;
    }
    
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    
    setShowProductoModal(false);
    setBusquedaProducto('');
    setStockWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[producto.id];
      return newWarnings;
    });
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    
    const producto = carrito.find(item => item.id === id);
    if (producto && nuevaCantidad > producto.stock) {
      setStockWarnings(prev => ({
        ...prev,
        [id]: `Stock insuficiente. Disponible: ${producto.stock}`
      }));
      return;
    }
    
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
    
    setStockWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[id];
      return newWarnings;
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularSubtotal = () => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  const calcularImpuesto = () => {
    return calcularSubtotal() * 0.13; // 13% IVA
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularImpuesto();
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (!clienteSeleccionado) {
      alert('Selecciona un cliente');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para el backend
      const ventaData = {
        cliente: clienteSeleccionado.id,
        metodo_pago: metodoPago,
        items: carrito.map(item => ({
          producto: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_venta || item.precio
        }))
      };

      const result = await ventasAPI.create(ventaData);
      
      alert('Venta procesada exitosamente');
      
      // Preguntar si desea imprimir comprobante
      if (window.confirm('¿Desea imprimir el comprobante?')) {
        const ventaCompleta = {
          id: result.id,
          fecha: result.fecha_venta || new Date().toISOString(),
          cliente: clienteSeleccionado,
          items: carrito,
          subtotal: calcularSubtotal(),
          impuesto: calcularImpuesto(),
          total: calcularTotal(),
          metodoPago
        };
        imprimirComprobante(ventaCompleta);
      }
      
      // Limpiar formulario
      setCarrito([]);
      setClienteSeleccionado(null);
      setMetodoPago('efectivo');
      setStockWarnings({});
      
    } catch (err) {
      console.error('Error procesando venta:', err);
      alert('Error al procesar la venta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDFVenta = async (ventaId) => {
    try {
      setLoading(true);
      const blob = await ventasAPI.generarPDF(ventaId);
      const venta = ventasHistorial.find(v => v.id === ventaId);
      const filename = generarNombreArchivoPDF(ventaId, venta?.fecha_venta || new Date());
      downloadPDF(blob, filename);
    } catch (err) {
      console.error('Error descargando PDF:', err);
      alert('Error al generar PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    setCurrentPage(1);
    alert('Filtros aplicados');
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      metodoPago: ''
    });
    setCurrentPage(1);
  };

  const handleNuevoCliente = (nuevoCliente) => {
    setClienteSeleccionado(nuevoCliente);
    alert(`Cliente ${nuevoCliente.nombre} creado y seleccionado`);
  };



  return (
    <div className="ventas-page">
      {/* Tabs */}
      <div className="ventas-tabs">
        <button
          className={`tab-btn ${activeTab === 'nueva' ? 'active' : ''}`}
          onClick={() => setActiveTab('nueva')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Nueva Venta
        </button>
        <button
          className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial de Ventas
        </button>
      </div>

      {/* Nueva Venta */}
      {activeTab === 'nueva' && (
        <div className="nueva-venta-container">
          <div className="venta-grid">
            {/* Panel izquierdo - Productos y Carrito */}
            <div className="venta-main">
              {/* Búsqueda de productos */}
              <div className="card search-card">
                <div className="search-header">
                  <h3>Agregar Productos</h3>
                  <button className="scan-btn" onClick={() => alert('Función de escaneo disponible cuando conectes un escáner de código de barras')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Escanear
                  </button>
                </div>
                <div className="search-input-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={busquedaProducto}
                    onChange={(e) => {
                      setBusquedaProducto(e.target.value);
                      setShowProductoModal(e.target.value.length > 0);
                    }}
                    className="search-input"
                  />
                </div>

                {/* Modal de productos */}
                {showProductoModal && busquedaProducto && (
                  <div className="productos-dropdown">
                    {productosFiltrados.length > 0 ? (
                      productosFiltrados.map(producto => (
                        <div
                          key={producto.id}
                          className="producto-item"
                          onClick={() => agregarAlCarrito(producto)}
                        >
                          <div className="producto-info">
                            <span className="producto-nombre">{producto.nombre}</span>
                            <span className="producto-codigo">{producto.codigo}</span>
                          </div>
                          <div className="producto-details">
                            <span className="producto-precio">${producto.precio}</span>
                            <span className="producto-stock">Stock: {producto.stock}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">No se encontraron productos</div>
                    )}
                  </div>
                )}
              </div>

              {/* Carrito */}
              <div className="card carrito-card">
                <h3>Carrito de Compra</h3>
                {carrito.length === 0 ? (
                  <div className="carrito-vacio">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p>El carrito está vacío</p>
                    <span>Busca y agrega productos para comenzar</span>
                  </div>
                ) : (
                  <div className="carrito-items">
                    {carrito.map(item => (
                      <div key={item.id} className="carrito-item">
                        <div className="item-info">
                          <h4>{item.nombre}</h4>
                          <span className="item-codigo">{item.codigo}</span>
                          {stockWarnings[item.id] && (
                            <span className="stock-warning">{stockWarnings[item.id]}</span>
                          )}
                        </div>
                        <div className="item-controls">
                          <div className="cantidad-control">
                            <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>-</button>
                            <input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value) || 0)}
                              min="1"
                            />
                            <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
                          </div>
                          <span className="item-precio">${(item.precio * item.cantidad).toFixed(2)}</span>
                          <button
                            className="item-delete"
                            onClick={() => eliminarDelCarrito(item.id)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Panel derecho - Cliente y Resumen */}
            <div className="venta-sidebar">
              {/* Cliente */}
              <div className="card cliente-card">
                <h3>Cliente</h3>
                {!clienteSeleccionado ? (
                  <div>
                    <div className="search-input-wrapper">
                      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={busquedaCliente}
                        onChange={(e) => {
                          setBusquedaCliente(e.target.value);
                          setShowClienteModal(e.target.value.length > 0);
                        }}
                        className="search-input"
                      />
                    </div>

                    {showClienteModal && busquedaCliente && (
                      <div className="clientes-dropdown">
                        {clientesFiltrados.map(cliente => (
                          <div
                            key={cliente.id}
                            className="cliente-item"
                            onClick={() => {
                              setClienteSeleccionado(cliente);
                              setShowClienteModal(false);
                              setBusquedaCliente('');
                            }}
                          >
                            <div className="cliente-avatar">{cliente.nombre.charAt(0)}</div>
                            <div className="cliente-info">
                              <span className="cliente-nombre">{cliente.nombre}</span>
                              <span className="cliente-nit">NIT: {cliente.nit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      className="btn-secondary"
                      onClick={() => setShowNuevoClienteModal(true)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      Nuevo Cliente
                    </button>
                  </div>
                ) : (
                  <div className="cliente-seleccionado">
                    <div className="cliente-header">
                      <div className="cliente-avatar-large">
                        {clienteSeleccionado.nombre.charAt(0)}
                      </div>
                      <button
                        className="btn-icon"
                        onClick={() => setClienteSeleccionado(null)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <h4>{clienteSeleccionado.nombre}</h4>
                    <div className="cliente-detalles">
                      <p><strong>NIT:</strong> {clienteSeleccionado.nit}</p>
                      <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
                      <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Método de Pago */}
              <div className="card pago-card">
                <h3>Método de Pago</h3>
                <div className="metodos-pago">
                  <label className={`metodo-item ${metodoPago === 'efectivo' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={metodoPago === 'efectivo'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Efectivo</span>
                  </label>
                  <label className={`metodo-item ${metodoPago === 'tarjeta' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={metodoPago === 'tarjeta'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Tarjeta</span>
                  </label>
                  <label className={`metodo-item ${metodoPago === 'transferencia' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={metodoPago === 'transferencia'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Transferencia</span>
                  </label>
                  <label className={`metodo-item ${metodoPago === 'paypal' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="paypal"
                      checked={metodoPago === 'paypal'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              {/* Resumen */}
              <div className="card resumen-card">
                <h3>Resumen</h3>
                <div className="resumen-linea">
                  <span>Subtotal:</span>
                  <span>${calcularSubtotal().toFixed(2)}</span>
                </div>
                <div className="resumen-linea">
                  <span>IVA (13%):</span>
                  <span>${calcularImpuesto().toFixed(2)}</span>
                </div>
                <div className="resumen-divider"></div>
                <div className="resumen-total">
                  <span>Total:</span>
                  <span>${calcularTotal().toFixed(2)}</span>
                </div>
                <button
                  className="btn-primary btn-procesar"
                  onClick={procesarVenta}
                  disabled={carrito.length === 0 || !clienteSeleccionado}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Procesar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Ventas */}
      {activeTab === 'historial' && (
        <div className="historial-container">
          <div className="historial-header">
            <h2>Historial de Ventas</h2>
            <div className="historial-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowFiltros(!showFiltros)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </button>
              <div className="export-dropdown">
                <button className="btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar
                </button>
                <div className="export-menu">
                  <button onClick={() => exportVentasToCSV(ventasHistorial, generateFilename('ventas', 'csv'))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exportar a CSV
                  </button>
                  <button onClick={() => exportVentasToExcel(ventasHistorial, generateFilename('ventas', 'xlsx'))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exportar a Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Filtros */}
          {showFiltros && (
            <div className="card filtros-panel">
              <h3>Filtrar Ventas</h3>
              <div className="filtros-grid">
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={filtros.estado}
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Todos</option>
                    <option value="completado">Completado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Método de Pago</label>
                  <select
                    value={filtros.metodoPago}
                    onChange={(e) => setFiltros({...filtros, metodoPago: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Todos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>
              <div className="filtros-actions">
                <button className="btn-primary" onClick={aplicarFiltros}>
                  Aplicar Filtros
                </button>
                <button className="btn-secondary" onClick={limpiarFiltros}>
                  Limpiar
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Items</th>
                  <th>Método Pago</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasHistorial.map(venta => (
                  <tr key={venta.id}>
                    <td>#{venta.id.toString().padStart(4, '0')}</td>
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.items}</td>
                    <td>
                      <span className="metodo-badge">{venta.metodoPago}</span>
                    </td>
                    <td className="total-cell">${venta.total}</td>
                    <td>
                      <span className={`status-badge status-${venta.estado}`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-btns">
                        <button className="btn-icon" title="Ver detalles">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Descargar PDF"
                          onClick={() => descargarPDFVenta(venta.id)}
                          disabled={loading}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              
              <div className="pagination-info">
                Página {currentPage} de {totalPages}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Siguiente
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      )}

      {/* Modal Nuevo Cliente */}
      <NuevoClienteModal
        isOpen={showNuevoClienteModal}
        onClose={() => setShowNuevoClienteModal(false)}
        onClienteCreado={handleNuevoCliente}
      />
    </div>
  );
};

export default Ventas;
