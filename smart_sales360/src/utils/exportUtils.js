/**
 * Utilidades para exportar datos a diferentes formatos
 */

// ============= DESCARGAR ARCHIVO =============
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ============= EXPORTAR A CSV =============
export const exportToCSV = (data, filename = 'export.csv', headers = null) => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Si no se proporcionan headers, usar las keys del primer objeto
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Crear filas CSV
  const csvRows = [];
  
  // Agregar headers
  csvRows.push(csvHeaders.join(','));
  
  // Agregar datos
  for (const row of data) {
    const values = csvHeaders.map(header => {
      const value = row[header];
      // Escapar comillas y comas
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Crear blob y descargar
  const csvString = csvRows.join('\n');
  const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

// ============= EXPORTAR A EXCEL (usando HTML) =============
export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Datos') => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const headers = Object.keys(data[0]);
  
  // Crear tabla HTML
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
  html += `<x:Name>${sheetName}</x:Name>`;
  html += '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
  html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
  html += '<meta charset="UTF-8">';
  html += '<style>table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #8B1E2D; color: white; font-weight: bold; }</style>';
  html += '</head><body>';
  html += '<table>';
  
  // Headers
  html += '<thead><tr>';
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead>';
  
  // Datos
  html += '<tbody>';
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      html += `<td>${row[header] || ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></body></html>';
  
  // Crear blob y descargar
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  downloadFile(blob, filename);
};

// ============= EXPORTAR TABLA HTML A EXCEL =============
export const exportTableToExcel = (tableId, filename = 'export.xlsx', sheetName = 'Datos') => {
  const table = document.getElementById(tableId);
  if (!table) {
    alert('Tabla no encontrada');
    return;
  }

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
  html += `<x:Name>${sheetName}</x:Name>`;
  html += '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
  html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
  html += '<meta charset="UTF-8">';
  html += '<style>table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #8B1E2D; color: white; font-weight: bold; }</style>';
  html += '</head><body>';
  html += table.outerHTML;
  html += '</body></html>';
  
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  downloadFile(blob, filename);
};

// ============= EXPORTAR VENTAS A CSV =============
export const exportVentasToCSV = (ventas, filename = 'ventas.csv') => {
  const data = ventas.map(venta => ({
    'ID': venta.id,
    'Fecha': new Date(venta.fecha || venta.fecha_venta).toLocaleString('es-ES'),
    'Cliente': venta.cliente?.nombre || venta.cliente,
    'Items': venta.items,
    'Método Pago': venta.metodoPago || venta.metodo_pago,
    'Total': `$${venta.total}`,
    'Estado': venta.estado
  }));
  
  exportToCSV(data, filename);
};

// ============= EXPORTAR VENTAS A EXCEL =============
export const exportVentasToExcel = (ventas, filename = 'ventas.xlsx') => {
  const data = ventas.map(venta => ({
    'ID': venta.id,
    'Fecha': new Date(venta.fecha || venta.fecha_venta).toLocaleString('es-ES'),
    'Cliente': venta.cliente?.nombre || venta.cliente,
    'Items': venta.items,
    'Método Pago': venta.metodoPago || venta.metodo_pago,
    'Total': `$${venta.total}`,
    'Estado': venta.estado
  }));
  
  exportToExcel(data, filename, 'Ventas');
};

// ============= EXPORTAR PRODUCTOS A CSV =============
export const exportProductosToCSV = (productos, filename = 'productos.csv') => {
  const data = productos.map(producto => ({
    'ID': producto.id,
    'Nombre': producto.nombre,
    'SKU': producto.sku,
    'Código Barras': producto.codigo_barras || '',
    'Precio Venta': `$${producto.precio_venta || producto.precio}`,
    'Stock': producto.stock_actual || producto.stock,
    'Stock Mínimo': producto.stock_minimo || '',
    'Categoría': producto.categoria || ''
  }));
  
  exportToCSV(data, filename);
};

// ============= EXPORTAR PRODUCTOS A EXCEL =============
export const exportProductosToExcel = (productos, filename = 'productos.xlsx') => {
  const data = productos.map(producto => ({
    'ID': producto.id,
    'Nombre': producto.nombre,
    'SKU': producto.sku,
    'Código Barras': producto.codigo_barras || '',
    'Precio Venta': `$${producto.precio_venta || producto.precio}`,
    'Stock': producto.stock_actual || producto.stock,
    'Stock Mínimo': producto.stock_minimo || '',
    'Categoría': producto.categoria || ''
  }));
  
  exportToExcel(data, filename, 'Productos');
};

// ============= EXPORTAR CLIENTES A CSV =============
export const exportClientesToCSV = (clientes, filename = 'clientes.csv') => {
  const data = clientes.map(cliente => ({
    'ID': cliente.id,
    'Nombre': cliente.nombre || cliente.nombre_completo,
    'Email': cliente.email,
    'Teléfono': cliente.telefono || '',
    'NIT': cliente.nit || '',
    'Dirección': cliente.direccion || ''
  }));
  
  exportToCSV(data, filename);
};

// ============= EXPORTAR CLIENTES A EXCEL =============
export const exportClientesToExcel = (clientes, filename = 'clientes.xlsx') => {
  const data = clientes.map(cliente => ({
    'ID': cliente.id,
    'Nombre': cliente.nombre || cliente.nombre_completo,
    'Email': cliente.email,
    'Teléfono': cliente.telefono || '',
    'NIT': cliente.nit || '',
    'Dirección': cliente.direccion || ''
  }));
  
  exportToExcel(data, filename, 'Clientes');
};

// ============= GENERAR NOMBRE DE ARCHIVO CON FECHA =============
export const generateFilename = (base, extension) => {
  const fecha = new Date().toISOString().split('T')[0];
  return `${base}_${fecha}.${extension}`;
};

export default {
  downloadFile,
  exportToCSV,
  exportToExcel,
  exportTableToExcel,
  exportVentasToCSV,
  exportVentasToExcel,
  exportProductosToCSV,
  exportProductosToExcel,
  exportClientesToCSV,
  exportClientesToExcel,
  generateFilename
};
