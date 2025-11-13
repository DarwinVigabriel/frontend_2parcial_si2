// src/services/auditService.js
class AuditService {
  constructor() {
    this.STORAGE_KEY = 'bitacora_eventos';
    this.MAX_EVENTOS = 1000;
  }
  
  // Método privado para obtener usuario actual
  _getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Método privado para generar ID único
  _generateId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Método privado para obtener eventos actuales
  _getEventos() {
    try {
      const eventosStr = localStorage.getItem(this.STORAGE_KEY);
      return eventosStr ? JSON.parse(eventosStr) : [];
    } catch (error) {
      console.error('Error al leer eventos:', error);
      return [];
    }
  }
  
  // Método privado para guardar eventos
  _saveEventos(eventos) {
    try {
      // Limitar a MAX_EVENTOS (eliminar los más antiguos)
      if (eventos.length > this.MAX_EVENTOS) {
        eventos = eventos.slice(-this.MAX_EVENTOS);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventos));
    } catch (error) {
      console.error('Error al guardar eventos:', error);
      // Si localStorage está lleno, eliminar eventos antiguos
      if (error.name === 'QuotaExceededError') {
        const eventosReducidos = eventos.slice(-500);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventosReducidos));
      }
    }
  }
  
  // Método genérico para registrar eventos
  log(tipoAccion, modulo, descripcion, datosAdicionales = null) {
    const user = this._getCurrentUser();
    if (!user) return; // No registrar si no hay usuario autenticado
    
    const evento = {
      id: this._generateId(),
      timestamp: new Date().toISOString(),
      usuario_nombre: user.nombre || user.username || user.email || 'Usuario',
      usuario_email: user.email || '',
      usuario_rol: user.rol || 'usuario',
      tipo_accion: tipoAccion,
      modulo: modulo,
      descripcion: descripcion,
      datos_adicionales: datosAdicionales
    };
    
    // Obtener eventos actuales
    const eventos = this._getEventos();
    
    // Agregar nuevo evento
    eventos.push(evento);
    
    // Guardar eventos actualizados
    this._saveEventos(eventos);
  }
  
  // Métodos específicos para cada tipo de acción
  logLogin(usuario) {
    this.log('LOGIN', 'DASHBOARD', `Usuario ${usuario} inició sesión`);
  }
  
  logLogout(usuario) {
    this.log('LOGOUT', 'DASHBOARD', `Usuario ${usuario} cerró sesión`);
  }
  
  logCreate(modulo, descripcion, datos = null) {
    this.log('CREATE', modulo, descripcion, datos);
  }
  
  logUpdate(modulo, descripcion, datos = null) {
    this.log('UPDATE', modulo, descripcion, datos);
  }
  
  logDelete(modulo, descripcion, datos = null) {
    this.log('DELETE', modulo, descripcion, datos);
  }
  
  logView(modulo, descripcion = null) {
    const desc = descripcion || `Acceso al módulo ${modulo}`;
    this.log('VIEW', modulo, desc);
  }
  
  // Método para obtener todos los eventos (usado por componente Bitacora)
  getAllEventos() {
    return this._getEventos();
  }
  
  // Método para limpiar todos los eventos
  clearEventos() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default new AuditService();
