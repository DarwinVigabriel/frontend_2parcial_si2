import { useState, useEffect } from 'react';
import { reportesAPI } from '../services/api';
import { downloadFile, generateFilename } from '../utils/exportUtils';
import './Reportes.css';

const Reportes = () => {
  const [activeTab, setActiveTab] = useState('generar'); // 'generar' o 'historial'
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Formulario para nuevo reporte
  const [formData, setFormData] = useState({
    titulo: '',
    tipo_reporte: 'ventas',
    formato: 'pdf',
    fecha_inicio: '',
    fecha_fin: '',
    incluir_voz: false,
    agrupar_por: 'dia'
  });

  // Datos mock de reportes
  const reportesMock = [
    {
      id: 1,
      titulo: 'Ventas Noviembre 2024',
      tipo_reporte: 'ventas',
      formato: 'pdf',
      estado: 'completado',
      fecha_generacion: '2024-11-13T10:30:00',
      total_registros: 150,
      tiempo_generacion: 2.5
    },
    {
      id: 2,
      titulo: 'Productos Más Vendidos',
      tipo_reporte: 'productos',
      formato: 'excel',
      estado: 'completado',
      fecha_generacion: '2024-11-12T15:20:00',
      total_registros: 45,
      tiempo_generacion: 1.8
    },
    {
      id: 3,
      titulo: 'Estadísticas Mensuales',
      tipo_reporte: 'estadisticas',
      formato: 'pdf',
      estado: 'generando',
      fecha_generacion: '2024-11-13T11:00:00',
      total_registros: 0,
      tiempo_generacion: 0
    }
  ];

  useEffect(() => {
    if (activeTab === 'historial') {
      cargarReportes();
    }
  }, [activeTab]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const data = await reportesAPI.getAll();
      // El backend puede devolver { reportes: [...] } o directamente [...]
      const reportesList = data.reportes || data.results || data;
      setReportes(Array.isArray(reportesList) ? reportesList : []);
    } catch (err) {
      console.error('Error cargando reportes:', err);
      // Fallback a datos mock si falla
      setReportes(reportesMock);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.fecha_inicio || !formData.fecha_fin) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const nuevoReporte = await reportesAPI.create(formData);
      
      alert('Reporte generado exitosamente');
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        tipo_reporte: 'ventas',
        formato: 'pdf',
        fecha_inicio: '',
        fecha_fin: '',
        incluir_voz: false,
        agrupar_por: 'dia'
      });
      
      // Cambiar a tab de historial
      setActiveTab('historial');
      cargarReportes();
    } catch (err) {
      console.error('Error al generar reporte:', err);
      alert('Error al generar reporte: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async (reporteId, formato) => {
    try {
      setLoading(true);
      
      // Buscar el reporte para obtener su título
      const reporte = reportes.find(r => r.id === reporteId);
      const filename = generateFilename(
        reporte?.titulo.replace(/\s+/g, '_') || `reporte_${reporteId}`,
        formato
      );
      
      // Intentar descargar desde el backend
      try {
        const blob = await reportesAPI.descargar(reporteId);
        downloadFile(blob, filename);
        alert('Reporte descargado exitosamente');
      } catch (apiError) {
        console.error('Error con API, usando fallback:', apiError);
        // Fallback: simular descarga
        alert(`Descargando reporte: ${filename}\n\nNota: Conecta con el backend para descargas reales.`);
      }
    } catch (err) {
      alert('Error al descargar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReproducirVoz = async (reporteId) => {
    try {
      setLoading(true);
      const audioBlob = await reportesAPI.obtenerVoz(reporteId);
      
      // Crear URL del blob y reproducir
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      
      alert('Reproduciendo resumen en voz');
      
      // Limpiar URL cuando termine
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (err) {
      console.error('Error al reproducir voz:', err);
      alert('Error al reproducir voz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      ventas: <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
      productos: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
      estadisticas: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    };
    return icons[tipo] || icons.ventas;
  };

  const getFormatoIcon = (formato) => {
    const icons = {
      pdf: <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
      excel: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      csv: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    };
    return icons[formato] || icons.pdf;
  };

  return (
    <div className="reportes-page">
      {/* Tabs */}
      <div className="reportes-tabs">
        <button
          className={`tab-btn ${activeTab === 'generar' ? 'active' : ''}`}
          onClick={() => setActiveTab('generar')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Generar Reporte
        </button>
        <button
          className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial de Reportes
        </button>
      </div>

      {/* Generar Reporte */}
      {activeTab === 'generar' && (
        <div className="generar-container">
          <div className="page-header">
            <div>
              <h2>Generar Nuevo Reporte</h2>
              <p>Crea reportes personalizados con filtros avanzados</p>
            </div>
          </div>

          <form onSubmit={handleGenerarReporte} className="reporte-form">
            <div className="form-grid">
              {/* Información Básica */}
              <div className="form-section">
                <h3>Información Básica</h3>
                
                <div className="form-group">
                  <label>Título del Reporte *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ej: Ventas Noviembre 2024"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Reporte *</label>
                    <select
                      value={formData.tipo_reporte}
                      onChange={(e) => setFormData({...formData, tipo_reporte: e.target.value})}
                      required
                    >
                      <option value="ventas">Ventas</option>
                      <option value="productos">Productos</option>
                      <option value="estadisticas">Estadísticas</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Formato *</label>
                    <select
                      value={formData.formato}
                      onChange={(e) => setFormData({...formData, formato: e.target.value})}
                      required
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filtros */}
              <div className="form-section">
                <h3>Filtros</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Inicio *</label>
                    <input
                      type="date"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Fecha Fin *</label>
                    <input
                      type="date"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Agrupar Por</label>
                  <select
                    value={formData.agrupar_por}
                    onChange={(e) => setFormData({...formData, agrupar_por: e.target.value})}
                  >
                    <option value="dia">Por Día</option>
                    <option value="semana">Por Semana</option>
                    <option value="mes">Por Mes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.incluir_voz}
                      onChange={(e) => setFormData({...formData, incluir_voz: e.target.checked})}
                    />
                    <span>Incluir resumen en voz (audio MP3)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Información del Reporte */}
            <div className="reporte-info">
              <div className="info-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4>¿Qué incluye este reporte?</h4>
                  <ul>
                    {formData.tipo_reporte === 'ventas' && (
                      <>
                        <li>Lista detallada de ventas</li>
                        <li>Total vendido y cantidad de ventas</li>
                        <li>Promedio de venta</li>
                        <li>Gráficas de tendencias</li>
                      </>
                    )}
                    {formData.tipo_reporte === 'productos' && (
                      <>
                        <li>Productos más vendidos</li>
                        <li>Cantidad vendida por producto</li>
                        <li>Ingresos por producto</li>
                        <li>Gráficas de comparación</li>
                      </>
                    )}
                    {formData.tipo_reporte === 'estadisticas' && (
                      <>
                        <li>Resumen general de ventas</li>
                        <li>Total de descuentos e impuestos</li>
                        <li>Métricas clave del negocio</li>
                        <li>Gráficas de rendimiento</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFormData({
                  titulo: '',
                  tipo_reporte: 'ventas',
                  formato: 'pdf',
                  fecha_inicio: '',
                  fecha_fin: '',
                  incluir_voz: false,
                  agrupar_por: 'dia'
                })}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {loading ? 'Generando...' : 'Generar Reporte'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial de Reportes */}
      {activeTab === 'historial' && (
        <div className="historial-container">
          <div className="page-header">
            <div>
              <h2>Historial de Reportes</h2>
              <p>Accede a todos tus reportes generados</p>
            </div>
            <button className="btn-secondary" onClick={cargarReportes}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          <div className="reportes-grid">
            {reportes.map(reporte => (
              <div key={reporte.id} className="reporte-card">
                <div className="reporte-header">
                  <div className="reporte-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {getTipoIcon(reporte.tipo_reporte)}
                    </svg>
                  </div>
                  <span className={`estado-badge estado-${reporte.estado}`}>
                    {reporte.estado === 'completado' ? 'Completado' : 
                     reporte.estado === 'generando' ? 'Generando...' : 'Error'}
                  </span>
                </div>

                <h3>{reporte.titulo}</h3>

                <div className="reporte-meta">
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(reporte.fecha_generacion).toLocaleString('es-ES')}</span>
                  </div>
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {getFormatoIcon(reporte.formato)}
                    </svg>
                    <span>{reporte.formato.toUpperCase()}</span>
                  </div>
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{reporte.total_registros} registros</span>
                  </div>
                </div>

                {reporte.estado === 'completado' && (
                  <div className="reporte-actions">
                    <button
                      className="btn-action"
                      onClick={() => handleDescargar(reporte.id, reporte.formato)}
                      title="Descargar"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar
                    </button>
                    <button
                      className="btn-action btn-voice"
                      onClick={() => handleReproducirVoz(reporte.id)}
                      title="Reproducir resumen en voz"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      Voz
                    </button>
                  </div>
                )}

                {reporte.estado === 'generando' && (
                  <div className="reporte-loading">
                    <div className="loading-spinner-small"></div>
                    <span>Generando reporte...</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {reportes.length === 0 && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No hay reportes generados</p>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('generar')}
              >
                Generar Primer Reporte
              </button>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Procesando...</p>
        </div>
      )}
    </div>
  );
};

export default Reportes;
