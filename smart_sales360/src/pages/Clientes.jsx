import { useState, useEffect } from 'react';
import './Clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);

  // Datos mock temporales
  const clientesMock = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      telefono: '70123456',
      nit: '1234567',
      direccion: 'Av. Siempre Viva 123'
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria@email.com',
      telefono: '71234567',
      nit: '7654321',
      direccion: 'Calle Falsa 456'
    }
  ];

  useEffect(() => {
    // TODO: Conectar con backend
    setTimeout(() => {
      setClientes(clientesMock);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nit.includes(searchTerm)
  );

  const handleNuevoCliente = () => {
    setEditingCliente(null);
    setShowModal(true);
  };

  const handleEditarCliente = (cliente) => {
    setEditingCliente(cliente);
    setShowModal(true);
  };

  const handleEliminarCliente = (id) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      // TODO: Implementar eliminación
      console.log('Eliminar cliente:', id);
    }
  };

  if (loading) {
    return (
      <div className="clientes-container">
        <div className="loading">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="clientes-container">
      {/* Header */}
      <div className="clientes-header">
        <div className="header-left">
          <h1>Gestión de Clientes</h1>
          <p className="subtitle">Administra tu cartera de clientes</p>
        </div>
        <button className="btn-nuevo" onClick={handleNuevoCliente}>
          <span className="icon">+</span>
          Nuevo Cliente
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="clientes-toolbar">
        <div className="search-box">
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, email o NIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className="btn-secondary">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </span>
            Exportar
          </button>
          <button className="btn-secondary">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </span>
            Filtros
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="clientes-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{clientes.length}</div>
            <div className="stat-label">Total Clientes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{clientes.length}</div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Nuevos (mes)</div>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="clientes-table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>NIT</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              filteredClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>#{cliente.id}</td>
                  <td>
                    <div className="cliente-nombre">
                      <div className="avatar">{cliente.nombre.charAt(0)}</div>
                      <strong>{cliente.nombre}</strong>
                    </div>
                  </td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.nit}</td>
                  <td className="direccion-cell">{cliente.direccion}</td>
                  <td>
                    <div className="acciones">
                      <button
                        className="btn-icon btn-editar"
                        onClick={() => handleEditarCliente(cliente)}
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-eliminar"
                        onClick={() => handleEliminarCliente(cliente.id)}
                        title="Eliminar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (placeholder) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Formulario de cliente (por implementar)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
