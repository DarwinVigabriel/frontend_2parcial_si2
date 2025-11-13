// Función para formatear fecha
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

// Exportar a CSV
export const exportarCSV = (eventos) => {
  const headers = ['Fecha/Hora', 'Usuario', 'Rol', 'Acción', 'Módulo', 'Descripción'];
  const rows = eventos.map(e => [
    formatearFecha(e.timestamp),
    e.usuario_nombre,
    e.usuario_rol,
    e.tipo_accion,
    e.modulo,
    e.descripcion
  ]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bitacora_${fecha}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar a Excel (usando una tabla HTML que Excel puede abrir)
export const exportarExcel = (eventos) => {
  let tabla = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #8B1E2D; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
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
  `;
  
  eventos.forEach(e => {
    tabla += `
      <tr>
        <td>${formatearFecha(e.timestamp)}</td>
        <td>${e.usuario_nombre}</td>
        <td>${e.usuario_rol}</td>
        <td>${e.tipo_accion}</td>
        <td>${e.modulo}</td>
        <td>${e.descripcion}</td>
      </tr>
    `;
  });
  
  tabla += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  const blob = new Blob([tabla], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bitacora_${fecha}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar a PDF (versión simple sin dependencias)
export const exportarPDF = (eventos) => {
  // Por ahora, usaremos window.print() con una ventana nueva
  const ventana = window.open('', '_blank');
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Bitácora de Auditoría</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #8B1E2D; text-align: center; }
        .fecha-generacion { text-align: center; color: #666; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th { background-color: #8B1E2D; color: white; padding: 10px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Bitácora de Auditoría - Smart Sales 365</h1>
      <p class="fecha-generacion">Generado el: ${formatearFecha(new Date().toISOString())}</p>
      <p class="fecha-generacion">Total de eventos: ${eventos.length}</p>
      
      <table>
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
  `;
  
  eventos.forEach(e => {
    html += `
      <tr>
        <td>${formatearFecha(e.timestamp)}</td>
        <td>${e.usuario_nombre}</td>
        <td>${e.usuario_rol}</td>
        <td>${e.tipo_accion}</td>
        <td>${e.modulo}</td>
        <td>${e.descripcion}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
      <br>
      <button onclick="window.print()" style="background: #8B1E2D; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
        Imprimir / Guardar como PDF
      </button>
    </body>
    </html>
  `;
  
  ventana.document.write(html);
  ventana.document.close();
};
