import { useState, useEffect } from 'react';
import './Usuarios.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [filterRol, setFilterRol] = useState('todos');

  // Datos mock temporales
  const usuariosMock = [
    {
      id: 1,
      nombre: 'Admin User',
      email: 'admin@smartsales.com',
      rol: 'Administrador',
      estado: 'Activo',
      ultimoAcceso: '2024-01-15 10:30'
    },
    {
      id: 2,
      nombre: 'Vendedor 1',
      email: 'vendedor1@smartsales.com',
      rol: 'Vendedor',
      estado: 'Activo',
      ultimoAcceso: '2024-01-15 09:15'
    },
    {
      id: 3,
      nombre: 'Vendedor 2',
      email: 'vendedor2@smartsales.com',
      rol: 'Vendedor',
      estado: 'Inactivo',
      ultimoAcceso: '2024-01-10 14:20'
    }
  ];

  useEffect(() => {
    // TODO: Conectar con backend
    setTimeout(() => {
      setUsuarios(usuariosMock);
      setLoading(false);
    }, 500);
  }, []);

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRol = filterRol === 'todos' || usuario.rol === filterRol;
    return matchSearch && matchRol;
  });

  const handleNuevoUsuario = () => {
    setEditingUsuario(null);
    setShowModal(true);
  };

  const handleEditarUsuario = (usuario) => {
    setEditingUsuario(usuario);
    setShowModal(true);
  };

  const handleEliminarUsuario = (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      // TODO: Implementar eliminación
      console.log('Eliminar usuario:', id);
    }
  };

  const handleToggleEstado = (id) => {
    // TODO: Implementar cambio de estado
    console.log('Toggle estado usuario:', id);
  };

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      {/* Header */}
      <div className="usuarios-header">
        <div className="header-left">
          <h1>Gestión de Usuarios</h1>
          <p className="subtitle">Administra los usuarios del sistema</p>
        </div>
        <button className="btn-nuevo" onClick={handleNuevoUsuario}>
          <span className="icon">+</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="usuarios-toolbar">
        <div className="search-box">
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <select 
            className="filter-select"
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
          >
            <option value="todos">Todos los roles</option>
            <option value="Administrador">Administrador</option>
            <option value="Vendedor">Vendedor</option>
          </select>
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
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="usuarios-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{usuarios.length}</div>
            <div className="stat-label">Total Usuarios</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {usuarios.filter(u => u.estado === 'Activo').length}
            </div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              <circle cx="18" cy="8" r="3" fill="#FFD700"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {usuarios.filter(u => u.rol === 'Administrador').length}
            </div>
            <div className="stat-label">Administradores</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {usuarios.filter(u => u.rol === 'Vendedor').length}
            </div>
            <div className="stat-label">Vendedores</div>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>#{usuario.id}</td>
                  <td>
                    <div className="usuario-info">
                      <div className="avatar">{usuario.nombre.charAt(0)}</div>
                      <strong>{usuario.nombre}</strong>
                    </div>
                  </td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge badge-${usuario.rol.toLowerCase()}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`estado estado-${usuario.estado.toLowerCase()}`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="fecha-cell">{usuario.ultimoAcceso}</td>
                  <td>
                    <div className="acciones">
                      <button
                        className="btn-icon btn-editar"
                        onClick={() => handleEditarUsuario(usuario)}
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-toggle"
                        onClick={() => handleToggleEstado(usuario.id)}
                        title={usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      >
                        {usuario.estado === 'Activo' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                          </svg>
                        )}
                      </button>
                      <button
                        className="btn-icon btn-eliminar"
                        onClick={() => handleEliminarUsuario(usuario.id)}
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
              <h2>{editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Formulario de usuario (por implementar)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
