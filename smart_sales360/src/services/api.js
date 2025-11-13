// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error en la petición' }));
    throw new Error(error.detail || error.message || 'Error en la petición');
  }
  return response.json();
};

// Helper para headers con autenticación
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }) // Django REST Framework usa Token
  };
};

// ============= AUTENTICACIÓN =============
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ============= PRODUCTOS =============
export const productosAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products/products/?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/products/${id}/`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/products/products/?search=${query}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getByBarcode: async (barcode) => {
    const response = await fetch(`${API_BASE_URL}/products/products/lookup_by_barcode/?barcode=${barcode}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  checkStock: async (id, cantidad) => {
    // Obtener el producto y verificar stock localmente
    const response = await fetch(`${API_BASE_URL}/products/products/${id}/`, {
      headers: getHeaders()
    });
    const producto = await handleResponse(response);
    return { disponible: producto.stock_actual >= cantidad };
  }
};

// ============= CLIENTES =============
export const clientesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/clients/?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}/`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/clients/?search=${query}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (clienteData) => {
    const response = await fetch(`${API_BASE_URL}/clients/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(clienteData)
    });
    return handleResponse(response);
  }
};

// ============= VENTAS =============
export const ventasAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/sales/ventas/?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sales/ventas/${id}/`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (ventaData) => {
    const response = await fetch(`${API_BASE_URL}/sales/ventas/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ventaData)
    });
    return handleResponse(response);
  },

  generarPDF: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sales/comprobante/${id}/generar_pdf/`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al generar PDF');
    }
    
    return response.blob();
  },

  procesarPago: async (ventaId, pagoData) => {
    const response = await fetch(`${API_BASE_URL}/sales/pagos/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ venta: ventaId, ...pagoData })
    });
    return handleResponse(response);
  }
};

// ============= DASHBOARD =============
export const dashboardAPI = {
  getStats: async (timeRange = 'week') => {
    const response = await fetch(`${API_BASE_URL}/sales/dashboard/estadisticas/?range=${timeRange}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getRecentSales: async (limit = 5) => {
    const response = await fetch(`${API_BASE_URL}/sales/historico/?limit=${limit}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getTopProducts: async (limit = 4) => {
    const response = await fetch(`${API_BASE_URL}/sales/dashboard/top_productos/?limit=${limit}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ============= REPORTES =============
export const reportesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/sales/reportes/?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sales/reportes/${id}/`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (reporteData) => {
    const response = await fetch(`${API_BASE_URL}/sales/reportes/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reporteData)
    });
    return handleResponse(response);
  },

  descargar: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sales/reportes/${id}/descargar/`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al descargar reporte');
    }
    
    return response.blob();
  },

  obtenerVoz: async (id, regenerar = false) => {
    const response = await fetch(`${API_BASE_URL}/sales/reportes/${id}/voz/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ regenerar })
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener audio');
    }
    
    return response.blob();
  },

  listarPorTipo: async (tipo, estado) => {
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (estado) params.append('estado', estado);
    
    const response = await fetch(`${API_BASE_URL}/sales/reportes/listar_por_tipo/?${params}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  productos: productosAPI,
  clientes: clientesAPI,
  ventas: ventasAPI,
  dashboard: dashboardAPI,
  reportes: reportesAPI
};
