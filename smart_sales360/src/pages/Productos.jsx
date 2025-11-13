import { useState, useEffect } from 'react';
import { productosAPI } from '../services/api';
import { exportProductosToCSV, exportProductosToExcel, generateFilename } from '../utils/exportUtils';
import productosData from '../data/productos';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    sku: '',
    codigo_barras: '',
    precio_venta: '',
    precio_compra: '',
    stock_actual: '',
    stock_minimo: '',
    descripcion: ''
  });

  // Usar datos centralizados (adaptados para vista de administrador)
  const productosMock = productosData.map(p => ({
    id: p.id,
    nombre: p.nombre,
    sku: p.sku,
    codigo_barras: p.codigo,
    precio_venta: p.precio,
    precio_compra: p.precio * 0.6, // 60% del precio de venta
    stock_actual: p.stock,
    stock_minimo: Math.floor(p.stock * 0.2), // 20% del stock actual
    descripcion: p.descripcion,
    imagen: p.imagen,
    categoria: p.categoria
  }));

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productosAPI.getAll();
      const productosList = Array.isArray(data) ? data : data.results || data.productos || [];
      setProductos(productosList);
    } catch (err) {
      console.error('Error cargando productos:', err);
      // Fallback a datos mock
      setProductos(productosMock);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.sku?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras?.includes(busqueda)
  );

  const handleNuevo = () => {
    setProductoEditando(null);
    setFormData({
      nombre: '',
      sku: '',
      codigo_barras: '',
      precio_venta: '',
      precio_compra: '',
      stock_actual: '',
      stock_minimo: '',
      descripcion: ''
    });
    setShowModal(true);
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre || '',
      sku: producto.sku || '',
      codigo_barras: producto.codigo_barras || '',
      precio_venta: producto.precio_venta || '',
      precio_compra: producto.precio_compra || '',
      stock_actual: producto.stock_actual || '',
      stock_minimo: producto.stock_minimo || '',
      descripcion: producto.descripcion || ''
    });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      setLoading(true);
      
      // Llamar al backend para eliminar
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/products/products/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }
      
      alert('Producto eliminado exitosamente');
      cargarProductos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const url = productoEditando 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/products/products/${productoEditando.id}/`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/products/products/`;
      
      const method = productoEditando ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al guardar producto');
      }
      
      alert(productoEditando ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      setShowModal(false);
      cargarProductos();
    } catch (err) {
      console.error('Error:', err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productos-page">
      <div className="page-header">
        <div>
          <h2>Gestión de Productos</h2>
          <p>Administra tu inventario de productos</p>
        </div>
        <div className="header-actions">
          <div className="export-dropdown">
            <button className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </button>
            <div className="export-menu">
              <button onClick={() => exportProductosToCSV(productos, generateFilename('productos', 'csv'))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar a CSV
              </button>
              <button onClick={() => exportProductosToExcel(productos, generateFilename('productos', 'xlsx'))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar a Excel
              </button>
            </div>
          </div>
          <button className="btn-primary" onClick={handleNuevo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="search-bar">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre, SKU o código de barras..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="productos-grid">
        {productosFiltrados.map(producto => (
          <div key={producto.id} className="producto-card">
            {producto.imagen && (
              <div className="producto-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
            )}
            <div className="producto-header">
              <h3>{producto.nombre}</h3>
              <div className="producto-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditar(producto)}
                  title="Editar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => handleEliminar(producto.id)}
                  title="Eliminar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="producto-info">
              <div className="info-row">
                <span className="label">SKU:</span>
                <span className="value">{producto.sku}</span>
              </div>
              <div className="info-row">
                <span className="label">Código:</span>
                <span className="value">{producto.codigo_barras}</span>
              </div>
              <div className="info-row">
                <span className="label">Precio:</span>
                <span className="value precio">${producto.precio_venta}</span>
              </div>
              <div className="info-row">
                <span className="label">Stock:</span>
                <span className={`value stock ${producto.stock_actual <= producto.stock_minimo ? 'bajo' : ''}`}>
                  {producto.stock_actual} unidades
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p>No se encontraron productos</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{productoEditando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Código de Barras</label>
                  <input
                    type="text"
                    value={formData.codigo_barras}
                    onChange={(e) => setFormData({...formData, codigo_barras: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio Venta *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_venta}
                    onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_compra}
                    onChange={(e) => setFormData({...formData, precio_compra: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Actual *</label>
                  <input
                    type="number"
                    value={formData.stock_actual}
                    onChange={(e) => setFormData({...formData, stock_actual: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.stock_minimo}
                    onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : productoEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      )}
    </div>
  );
};

export default Productos;
