import { useState } from 'react';
import './Configuracion.css';

function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState({
    // General
    nombreEmpresa: 'Smart Sales 360',
    nit: '123456789',
    direccion: 'Av. Principal 123',
    telefono: '70123456',
    email: 'contacto@smartsales.com',
    
    // Sistema
    moneda: 'BOB',
    idioma: 'es',
    timezone: 'America/La_Paz',
    formatoFecha: 'DD/MM/YYYY',
    
    // Ventas
    iva: 13,
    stockMinimo: 10,
    alertaStockBajo: true,
    
    // Notificaciones
    emailVentas: true,
    emailStockBajo: true,
    emailReportes: false
  });

  const [guardando, setGuardando] = useState(false);

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = () => {
    setGuardando(true);
    // TODO: Guardar en backend
    setTimeout(() => {
      setGuardando(false);
      alert('Configuración guardada exitosamente');
    }, 1000);
  };

  const renderGeneralTab = () => (
    <div className="config-section">
      <h3>Información de la Empresa</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Nombre de la Empresa</label>
          <input
            type="text"
            value={config.nombreEmpresa}
            onChange={(e) => handleChange('nombreEmpresa', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>NIT</label>
          <input
            type="text"
            value={config.nit}
            onChange={(e) => handleChange('nit', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label>Dirección</label>
          <input
            type="text"
            value={config.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="text"
            value={config.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSistemaTab = () => (
    <div className="config-section">
      <h3>Configuración del Sistema</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Moneda</label>
          <select
            value={config.moneda}
            onChange={(e) => handleChange('moneda', e.target.value)}
          >
            <option value="BOB">Bolivianos (BOB)</option>
            <option value="USD">Dólares (USD)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Idioma</label>
          <select
            value={config.idioma}
            onChange={(e) => handleChange('idioma', e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-group">
          <label>Zona Horaria</label>
          <select
            value={config.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
          >
            <option value="America/La_Paz">La Paz (GMT-4)</option>
            <option value="America/Lima">Lima (GMT-5)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Formato de Fecha</label>
          <select
            value={config.formatoFecha}
            onChange={(e) => handleChange('formatoFecha', e.target.value)}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderVentasTab = () => (
    <div className="config-section">
      <h3>Configuración de Ventas</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>IVA (%)</label>
          <input
            type="number"
            value={config.iva}
            onChange={(e) => handleChange('iva', parseFloat(e.target.value))}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label>Stock Mínimo por Defecto</label>
          <input
            type="number"
            value={config.stockMinimo}
            onChange={(e) => handleChange('stockMinimo', parseInt(e.target.value))}
            min="0"
          />
        </div>
        <div className="form-group full-width">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={config.alertaStockBajo}
              onChange={(e) => handleChange('alertaStockBajo', e.target.checked)}
            />
            <span>Activar alertas de stock bajo</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificacionesTab = () => (
    <div className="config-section">
      <h3>Notificaciones por Email</h3>
      <div className="notifications-list">
        <div className="notification-item">
          <div className="notification-info">
            <strong>Notificaciones de Ventas</strong>
            <p>Recibir email cuando se realiza una venta</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={config.emailVentas}
              onChange={(e) => handleChange('emailVentas', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <div className="notification-info">
            <strong>Alertas de Stock Bajo</strong>
            <p>Recibir email cuando un producto tiene stock bajo</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={config.emailStockBajo}
              onChange={(e) => handleChange('emailStockBajo', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <div className="notification-info">
            <strong>Reportes Semanales</strong>
            <p>Recibir resumen semanal de ventas y estadísticas</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={config.emailReportes}
              onChange={(e) => handleChange('emailReportes', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="configuracion-container">
      {/* Header */}
      <div className="configuracion-header">
        <div className="header-left">
          <h1>Configuración</h1>
          <p className="subtitle">Personaliza el sistema según tus necesidades</p>
        </div>
        <button 
          className="btn-guardar"
          onClick={handleGuardar}
          disabled={guardando}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Tabs */}
      <div className="config-tabs">
        <button
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          General
        </button>
        <button
          className={`tab ${activeTab === 'sistema' ? 'active' : ''}`}
          onClick={() => setActiveTab('sistema')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"/>
          </svg>
          Sistema
        </button>
        <button
          className={`tab ${activeTab === 'ventas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventas')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Ventas
        </button>
        <button
          className={`tab ${activeTab === 'notificaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('notificaciones')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Notificaciones
        </button>
      </div>

      {/* Content */}
      <div className="config-content">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'sistema' && renderSistemaTab()}
        {activeTab === 'ventas' && renderVentasTab()}
        {activeTab === 'notificaciones' && renderNotificacionesTab()}
      </div>

      {/* Info Box */}
      <div className="info-box">
        <div className="info-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
        <div className="info-content">
          <strong>Nota:</strong> Los cambios en la configuración se aplicarán inmediatamente 
          después de guardar. Algunos cambios pueden requerir reiniciar la sesión.
        </div>
      </div>
    </div>
  );
}

export default Configuracion;
