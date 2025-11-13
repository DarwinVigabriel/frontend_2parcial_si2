/**
 * Utilidades para generar y descargar PDFs de comprobantes
 */

/**
 * Descarga un PDF desde un blob
 */
export const downloadPDF = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Genera un comprobante de venta en formato HTML para imprimir
 * (Alternativa cuando el backend no está disponible)
 */
export const generarComprobanteHTML = (venta) => {
  const { id, fecha, cliente, items, subtotal, impuesto, total, metodoPago } = venta;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Comprobante de Venta #${id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #8B1E2D;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #8B1E2D;
          margin-bottom: 5px;
        }
        .document-title {
          font-size: 18px;
          color: #333;
          margin-top: 10px;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 5px;
        }
        .info-block { flex: 1; }
        .info-label {
          font-weight: bold;
          color: #666;
          font-size: 12px;
          margin-bottom: 5px;
        }
        .info-value {
          color: #333;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #8B1E2D;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 14px;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
          font-size: 13px;
        }
        tr:hover { background: #f9f9f9; }
        .totals {
          margin-left: auto;
          width: 300px;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .total-row.final {
          border-top: 2px solid #8B1E2D;
          margin-top: 10px;
          padding-top: 10px;
          font-size: 18px;
          font-weight: bold;
          color: #8B1E2D;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">Smart Sales 360</div>
        <div style="color: #666; font-size: 12px;">Gestiona tu negocio de manera inteligente</div>
        <div class="document-title">COMPROBANTE DE VENTA</div>
      </div>

      <div class="info-section">
        <div class="info-block">
          <div class="info-label">Nº COMPROBANTE</div>
          <div class="info-value">#${String(id).padStart(6, '0')}</div>
        </div>
        <div class="info-block">
          <div class="info-label">FECHA</div>
          <div class="info-value">${new Date(fecha).toLocaleString('es-ES')}</div>
        </div>
        <div class="info-block">
          <div class="info-label">MÉTODO DE PAGO</div>
          <div class="info-value" style="text-transform: capitalize;">${metodoPago}</div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-block">
          <div class="info-label">CLIENTE</div>
          <div class="info-value">${cliente.nombre}</div>
          <div class="info-value" style="font-size: 12px; color: #666;">
            NIT: ${cliente.nit} | ${cliente.email}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 50px;">Cant.</th>
            <th>Producto</th>
            <th style="width: 120px; text-align: right;">Precio Unit.</th>
            <th style="width: 120px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="text-align: center;">${item.cantidad}</td>
              <td>
                <strong>${item.nombre}</strong>
                <div style="font-size: 11px; color: #666;">${item.codigo}</div>
              </td>
              <td style="text-align: right;">$${item.precio.toFixed(2)}</td>
              <td style="text-align: right;">$${(item.precio * item.cantidad).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>IVA (13%):</span>
          <span>$${impuesto.toFixed(2)}</span>
        </div>
        <div class="total-row final">
          <span>TOTAL:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Gracias por su compra</p>
        <p style="margin-top: 5px;">Smart Sales 360 - Sistema de Gestión de Ventas</p>
      </div>

      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="
          background: #8B1E2D;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          margin-right: 10px;
        ">Imprimir</button>
        <button onclick="window.close()" style="
          background: #666;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        ">Cerrar</button>
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Abre el comprobante en una nueva ventana para imprimir
 */
export const imprimirComprobante = (venta) => {
  const html = generarComprobanteHTML(venta);
  const ventana = window.open('', '_blank', 'width=800,height=600');
  ventana.document.write(html);
  ventana.document.close();
};

/**
 * Genera un nombre de archivo para el PDF
 */
export const generarNombreArchivoPDF = (ventaId, fecha) => {
  const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
  return `comprobante_${String(ventaId).padStart(6, '0')}_${fechaFormateada}.pdf`;
};
