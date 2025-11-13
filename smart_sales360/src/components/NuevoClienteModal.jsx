import { useState } from 'react';
import { clientesAPI } from '../services/api';
import './NuevoClienteModal.css';

const NuevoClienteModal = ({ isOpen, onClose, onClienteCreado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    nit: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.nit) {
      setError('Nombre, email y NIT son obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para el backend
      const clienteData = {
        nombre_completo: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        nit: formData.nit,
        direccion: formData.direccion
      };
      
      const nuevoCliente = await clientesAPI.create(clienteData);

      alert('Cliente creado exitosamente');
      
      // Adaptar respuesta del backend al formato del frontend
      const clienteAdaptado = {
        id: nuevoCliente.id,
        nombre: nuevoCliente.nombre_completo || nuevoCliente.nombre,
        email: nuevoCliente.email,
        telefono: nuevoCliente.telefono,
        nit: nuevoCliente.nit,
        direccion: nuevoCliente.direccion
      };
      
      onClienteCreado(clienteAdaptado);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        nit: '',
        direccion: ''
      });
      
      onClose();
    } catch (err) {
      console.error('Error al crear cliente:', err);
      setError('Error al crear cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Cliente</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@email.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nit">NIT/CI *</label>
              <input
                type="text"
                id="nit"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                placeholder="1234567"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="555-0001"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle 123, Ciudad"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoClienteModal;
