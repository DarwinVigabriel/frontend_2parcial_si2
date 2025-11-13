# Funcionalidades Implementadas - Módulo de Ventas

## ✅ Funcionalidades Completadas

### 1. Conexión con Backend (API Calls)

**Archivo**: `src/services/api.js`

Se creó un servicio completo para manejar todas las llamadas al backend:

- **Autenticación**: Login y logout
- **Productos**: 
  - Búsqueda por nombre/código
  - Búsqueda por código de barras
  - Validación de stock
- **Clientes**: 
  - Búsqueda
  - Creación
- **Ventas**: 
  - Listado con paginación y filtros
  - Creación de ventas
  - Generación de PDF
  - Procesamiento de pagos

**Configuración**:
```javascript
// .env
VITE_API_URL=http://localhost:8000/api
```

**Uso**:
```javascript
import { productosAPI, clientesAPI, ventasAPI } from '../services/api';

// Buscar productos
const productos = await productosAPI.search('laptop');

// Crear venta
const venta = await ventasAPI.create(ventaData);
```

---

### 2. Escáner de Código de Barras

**Archivo**: `src/hooks/useBarcodeScanner.js`

Hook personalizado que detecta cuando un escáner de código de barras está siendo usado (simula escritura rápida del teclado).

**Características**:
- Detecta entrada rápida de caracteres
- Configurable (longitud mínima/máxima, timeout)
- Previene comportamiento por defecto
- Auto-reset después del timeout

**Uso**:
```javascript
const { isScanning } = useBarcodeScanner(async (barcode) => {
  console.log('Código escaneado:', barcode);
  await buscarProductoPorCodigo(barcode);
});
```

**Configuración** (`.env`):
```
VITE_BARCODE_MIN_LENGTH=3
VITE_BARCODE_MAX_LENGTH=20
VITE_BARCODE_TIMEOUT=100
```

**Cómo funciona**:
1. El usuario hace clic en el botón "Escanear"
2. El escáner lee el código de barras
3. El hook detecta la entrada rápida
4. Busca el producto automáticamente
5. Lo agrega al carrito

---

### 3. Validación de Stock

**Implementado en**: `src/pages/Ventas.jsx`

**Características**:
- Valida stock antes de agregar al carrito
- Muestra advertencias visuales
- Previene agregar más cantidad de la disponible
- Consulta al backend para stock en tiempo real

**Funciones**:
```javascript
// Validar stock con el backend
const validarStock = async (productoId, cantidad) => {
  const result = await productosAPI.checkStock(productoId, cantidad);
  return result.disponible;
};

// Agregar al carrito con validación
const agregarAlCarrito = async (producto) => {
  if (nuevaCantidad > producto.stock) {
    alert(`Stock insuficiente. Solo hay ${producto.stock} unidades`);
    return;
  }
  // ... agregar al carrito
};
```

**UI**:
- Mensaje de error si no hay stock
- Badge de advertencia en items del carrito
- Prevención de cantidades inválidas

---

### 4. Generación de PDF para Comprobantes

**Archivo**: `src/utils/pdfGenerator.js`

**Características**:
- Genera comprobantes en HTML para imprimir
- Descarga PDFs desde el backend
- Formato profesional con logo y datos de la empresa
- Incluye todos los detalles de la venta

**Funciones**:

```javascript
// Imprimir comprobante (abre ventana nueva)
imprimirComprobante(ventaData);

// Descargar PDF desde backend
const blob = await ventasAPI.generarPDF(ventaId);
downloadPDF(blob, 'comprobante_001.pdf');

// Generar nombre de archivo
const filename = generarNombreArchivoPDF(ventaId, fecha);
// Resultado: "comprobante_000001_2024-11-13.pdf"
```

**Contenido del comprobante**:
- Logo y nombre de la empresa
- Número de comprobante
- Fecha y hora
- Datos del cliente (nombre, NIT, email)
- Detalle de productos (cantidad, precio, subtotal)
- Subtotal, IVA (13%), Total
- Método de pago
- Botones para imprimir/cerrar

**Flujo**:
1. Usuario procesa una venta
2. Sistema pregunta si desea imprimir
3. Si acepta, abre ventana con comprobante
4. Usuario puede imprimir o descargar PDF

---

### 5. Filtros Avanzados en Historial

**Implementado en**: `src/pages/Ventas.jsx`

**Filtros disponibles**:
- **Fecha Inicio**: Filtrar desde una fecha
- **Fecha Fin**: Filtrar hasta una fecha
- **Estado**: Completado, Pendiente, Cancelado
- **Método de Pago**: Efectivo, Tarjeta, Transferencia, PayPal

**UI**:
```jsx
<div className="filtros-panel">
  <input type="date" value={filtros.fechaInicio} />
  <input type="date" value={filtros.fechaFin} />
  <select value={filtros.estado}>
    <option value="">Todos</option>
    <option value="completado">Completado</option>
    ...
  </select>
  <button onClick={aplicarFiltros}>Aplicar</button>
  <button onClick={limpiarFiltros}>Limpiar</button>
</div>
```

**Funciones**:
```javascript
const aplicarFiltros = () => {
  setCurrentPage(1);
  cargarVentas(); // Recarga con filtros
};

const limpiarFiltros = () => {
  setFiltros({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    metodoPago: ''
  });
};
```

---

### 6. Paginación en Historial

**Implementado en**: `src/pages/Ventas.jsx`

**Características**:
- Navegación entre páginas
- Muestra página actual y total
- Botones deshabilitados en límites
- Integrado con filtros

**UI**:
```jsx
<div className="pagination">
  <button onClick={() => setCurrentPage(prev => prev - 1)}>
    Anterior
  </button>
  <div>Página {currentPage} de {totalPages}</div>
  <button onClick={() => setCurrentPage(prev => prev + 1)}>
    Siguiente
  </button>
</div>
```

**Configuración** (`.env`):
```
VITE_ITEMS_PER_PAGE=10
```

---

## 🎨 Mejoras de UI/UX

### Loading States
- Overlay con spinner durante operaciones
- Botones deshabilitados mientras carga
- Mensajes de estado claros

### Búsqueda con Debounce
- Espera 300ms antes de buscar
- Reduce llamadas al backend
- Mejor experiencia de usuario

### Animaciones
- Botón de escaneo pulsa cuando está activo
- Dropdowns con animación slideDown
- Transiciones suaves en todos los elementos

### Responsive
- Todos los componentes adaptados a móvil
- Filtros en columna en pantallas pequeñas
- Paginación adaptativa

---

## 📋 Casos de Uso Cubiertos

- ✅ **CU10**: Escanear Código de Barras de Productos
- ✅ **CU11**: Gestionar Carrito de Compra (Web)
- ✅ **CU12**: Registrar Venta (Flujo central)
- ✅ **CU13**: Procesar Pago en Línea
- ✅ **CU14**: Emitir Comprobante de Venta (PDF)
- ✅ **CU15**: Listar Histórico de Ventas con Filtros
- ✅ **CU21**: Filtrar Datos y Exportar del Dashboard

---

## 🚀 Cómo Usar

### 1. Configurar Variables de Entorno

Copia `.env.example` a `.env` y configura:
```bash
cp .env.example .env
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

### 4. Probar Funcionalidades

**Nueva Venta**:
1. Busca productos por nombre o código
2. O usa el botón "Escanear" y escanea un código de barras
3. Selecciona un cliente
4. Elige método de pago
5. Procesa la venta
6. Imprime o descarga el comprobante

**Historial**:
1. Ve al tab "Historial de Ventas"
2. Usa filtros para buscar ventas específicas
3. Navega entre páginas
4. Descarga PDFs de comprobantes

---

## 🔧 Integración con Backend

### Endpoints Esperados

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/productos/search?q={query}
GET    /api/productos/barcode/{barcode}
GET    /api/productos/{id}/check-stock?cantidad={cantidad}
GET    /api/clientes/search?q={query}
POST   /api/clientes
GET    /api/ventas?page={page}&fechaInicio={fecha}&...
POST   /api/ventas
GET    /api/ventas/{id}/pdf
POST   /api/ventas/{id}/pago
```

### Formato de Datos

**Crear Venta**:
```json
{
  "cliente_id": 1,
  "items": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio": 1299
    }
  ],
  "metodo_pago": "efectivo",
  "subtotal": 2598,
  "impuesto": 337.74,
  "total": 2935.74
}
```

---

## 📝 Notas Importantes

1. **Fallback a Mock Data**: Si el backend no está disponible, la aplicación usa datos de ejemplo
2. **Validación de Stock**: Se valida tanto en frontend como backend
3. **Seguridad**: Todas las peticiones incluyen token de autenticación
4. **Error Handling**: Todos los errores se manejan y muestran al usuario
5. **Performance**: Búsquedas con debounce para reducir carga

---

## 🐛 Troubleshooting

**Problema**: El escáner no funciona
- **Solución**: Verifica que el escáner esté configurado para enviar Enter al final

**Problema**: No se generan PDFs
- **Solución**: Verifica que el backend tenga el endpoint `/ventas/{id}/pdf`

**Problema**: Stock no se valida
- **Solución**: Verifica la conexión con el backend y el endpoint de validación

---

## 🎯 Próximos Pasos Sugeridos

1. Implementar exportación a Excel del historial
2. Agregar gráficos de ventas en tiempo real
3. Implementar notificaciones push para ventas
4. Agregar soporte para múltiples monedas
5. Implementar descuentos y promociones
6. Agregar firma digital en comprobantes
