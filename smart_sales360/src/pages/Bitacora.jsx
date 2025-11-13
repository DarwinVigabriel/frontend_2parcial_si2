import { useState, useEffect, useMemo } from 'react';
import auditService from '../services/auditService';
import { exportarCSV, exportarExcel, exportarPDF } from '../utils/bitacoraExport';
import './Bitacora.css';

const Bitacora = () => {
  const [todosEventos, setTodosEventos] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    usuario: '',
    tipoAccion: '',
    modulo: ''
  });
  const [paginacion, setPaginacion] = useState({ page: 1, pageSize: 50 });
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Cargar eventos desde localStorage
  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = () => {
    const eventos = auditService.getAllEventos();
    setTodosEventos(eventos);
  };

  // Filtrar eventos en memoria
  const eventosFiltrados = useMemo(() => {
    let resultado = [...todosEventos];
    
    // Filtro por fecha inicio
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      resultado = resultado.filter(e => 
        new Date(e.timestamp) >= fechaInicio
      );
    }
    
    // Filtro por fecha fin
    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      resultado = resultado.filter(e => 
        new Date(e.timestamp) <= fechaFin
      );
    }
    
    // Filtro por usuario
    if (filtros.usuario) {
      resultado = resultado.filter(e => 
        e.usuario_nombre.toLowerCase().includes(filtros.usuario.toLowerCase())
      );
    }
    
    // Filtro por tipo de acción
    if (filtros.tipoAccion) {
      resultado = resultado.filter(e => e.tipo_accion === filtros.tipoAccion);
    }
    
    // Filtro por módulo
    if (filtros.modulo) {
      resultado = resultado.filter(e => e.modulo === filtros.modulo);
    }
    
    // Ordenar por timestamp descendente
    resultado.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return resultado;
  }, [todosEventos, filtros]);

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    
    const eventosHoy = todosEventos.filter(e => 
      new Date(e.timestamp) >= hoy
    );
    
    const eventos7Dias = todosEventos.filter(e => 
      new Date(e.timestamp) >= hace7Dias
    );
    
    const usuariosHoy = new Set(eventosHoy.map(e => e.usuario_email || e.usuario_nombre)).size;
    
    // Contar por tipo de acción
    const porTipoAccion = {};
    todosEventos.forEach(e => {
      porTipoAccion[e.tipo_accion] = (porTipoAccion[e.tipo_accion] || 0) + 1;
    });
    
    // Módulos más accedidos
    const porModulo = {};
    eventos7Dias.forEach(e => {
      porModulo[e.modulo] = (porModulo[e.modulo] || 0) + 1;
    });
    const modulosTop = Object.entries(porModulo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      eventos_hoy: eventosHoy.length,
      usuarios_activos_hoy: usuariosHoy,
      eventos_7_dias: eventos7Dias.length,
      por_tipo_accion: porTipoAccion,
      modulos_mas_accedidos: modulosTop
    };
  }, [todosEventos]);

  // Paginación
  const eventosPaginados = useMemo(() => {
    const inicio = (paginacion.page - 1) * paginacion.pageSize;
    const fin = inicio + paginacion.pageSize;
    return eventosFiltrados.slice(inicio, fin);
  }, [eventosFiltrados, paginacion]);

  const totalPaginas = Math.ceil(eventosFiltrados.length / paginacion.pageSize);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginacion(prev => ({ ...prev, page: 1 })); // Reset a página 1
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      usuario: '',
      tipoAccion: '',
      modulo: ''
    });
    setPaginacion({ page: 1, pageSize: 50 });
  };

  const handleExportar = (formato) => {
    if (formato === 'csv') {
      exportarCSV(eventosFiltrados);
    } else if (formato === 'excel') {
      exportarExcel(eventosFiltrados);
    } else if (formato === 'pdf') {
      exportarPDF(eventosFiltrados);
    }
  };

  const handleLimpiarBitacora = () => {
    auditService.clearEventos();
    setTodosEventos([]);
    setMostrarConfirmacion(false);
  };

  const formatearFecha = (timestamp) => {
    const fecha = new Date(timestamp);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTipoAccionColor = (tipo) => {
    const colores = {
      'LOGIN': '#10b981',
      'LOGOUT': '#6b7280',
      'CREATE': '#3b82f6',
      'UPDATE': '#f59e0b',
      'DELETE': '#ef4444',
      'VIEW': '#8b5cf6'
    };
    return colores[tipo] || '#6b7280';
  };

  return (
    <div className="bitacora-container">
      <div className="bitacora-header">
        <h1>Bitácora de Auditoría</h1>
        <p className="bitacora-subtitle">Registro completo de actividades del sistema</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.eventos_hoy}</div>
            <div className="stat-label">Eventos Hoy</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.usuarios_activos_hoy}</div>
            <div className="stat-label">Usuarios Activos Hoy</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.eventos_7_dias}</div>
            <div className="stat-label">Eventos (7 días)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{todosEventos.length}</div>
            <div className="stat-label">Total Eventos</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-panel">
        <div className="filtro-group">
          <label>Fecha Inicio</label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>Fecha Fin</label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={filtros.usuario}
            onChange={(e) => handleFiltroChange('usuario', e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>Tipo de Acción</label>
          <select
            value={filtros.tipoAccion}
            onChange={(e) => handleFiltroChange('tipoAccion', e.target.value)}
          >
            <option value="">Todas</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="CREATE">Crear</option>
            <option value="UPDATE">Actualizar</option>
            <option value="DELETE">Eliminar</option>
            <option value="VIEW">Visualizar</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Módulo</label>
          <select
            value={filtros.modulo}
            onChange={(e) => handleFiltroChange('modulo', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="DASHBOARD">Dashboard</option>
            <option value="VENTAS">Ventas</option>
            <option value="PRODUCTOS">Productos</option>
            <option value="CLIENTES">Clientes</option>
            <option value="USUARIOS">Usuarios</option>
            <option value="REPORTES">Reportes</option>
            <option value="CONFIGURACION">Configuración</option>
            <option value="TIENDA">Tienda</option>
            <option value="CARRITO">Carrito</option>
          </select>
        </div>

        <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
          Limpiar Filtros
        </button>
      </div>

      {/* Acciones */}
      <div className="bitacora-actions">
        <div className="export-buttons">
          <button className="btn-export btn-csv" onClick={() => handleExportar('csv')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
          <button className="btn-export btn-excel" onClick={() => handleExportar('excel')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Excel
          </button>
          <button className="btn-export btn-pdf" onClick={() => handleExportar('pdf')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Exportar PDF
          </button>
        </div>

        <button 
          className="btn-limpiar-bitacora" 
          onClick={() => setMostrarConfirmacion(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpiar Bitácora
        </button>
      </div>

      {/* Tabla de eventos */}
      <div className="eventos-table-container">
        <div className="table-info">
          <span>Mostrando {eventosPaginados.length} de {eventosFiltrados.length} eventos</span>
        </div>
        
        <table className="eventos-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acción</th>
              <th>Módulo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {eventosPaginados.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-eventos">
                  No hay eventos registrados
                </td>
              </tr>
            ) : (
              eventosPaginados.map(evento => (
                <tr key={evento.id}>
                  <td className="fecha-cell">{formatearFecha(evento.timestamp)}</td>
                  <td>{evento.usuario_nombre}</td>
                  <td>
                    <span className="rol-badge">{evento.usuario_rol}</span>
                  </td>
                  <td>
                    <span 
                      className="accion-badge" 
                      style={{ background: getTipoAccionColor(evento.tipo_accion) }}
                    >
                      {evento.tipo_accion}
                    </span>
                  </td>
                  <td>
                    <span className="modulo-badge">{evento.modulo}</span>
                  </td>
                  <td className="descripcion-cell">{evento.descripcion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="paginacion">
            <button
              onClick={() => setPaginacion(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={paginacion.page === 1}
              className="btn-paginacion"
            >
              Anterior
            </button>
            
            <span className="paginacion-info">
              Página {paginacion.page} de {totalPaginas}
            </span>
            
            <button
              onClick={() => setPaginacion(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={paginacion.page === totalPaginas}
              className="btn-paginacion"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="modal-overlay" onClick={() => setMostrarConfirmacion(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>¿Confirmar limpieza de bitácora?</h3>
            <p>Esta acción eliminará todos los eventos registrados y no se puede deshacer.</p>
            <div className="modal-actions">
              <button 
                className="btn-cancelar" 
                onClick={() => setMostrarConfirmacion(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar" 
                onClick={handleLimpiarBitacora}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bitacora;
