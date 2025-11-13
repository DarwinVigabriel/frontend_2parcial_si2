# 📱 Guía del Escáner de Código de Barras

## ¿Qué es y cómo funciona?

El escáner de código de barras es una funcionalidad que permite agregar productos al carrito simplemente escaneando su código de barras con un lector físico.

---

## 🔧 ¿Cómo Funciona Técnicamente?

### 1. El Escáner Físico

Un escáner de código de barras es un dispositivo que:
- Lee códigos de barras (1D o 2D/QR)
- Se conecta por USB o Bluetooth
- **Simula un teclado** - Escribe el código muy rápido y presiona Enter

### 2. El Hook `useBarcodeScanner`

Nuestro hook detecta cuando:
- Se escriben caracteres muy rápido (< 100ms entre teclas)
- Se presiona Enter al final
- El código tiene entre 3-20 caracteres

```javascript
// Ejemplo de uso
const { isScanning } = useBarcodeScanner(async (barcode) => {
  console.log('Código escaneado:', barcode);
  // Buscar producto y agregarlo al carrito
  await buscarProductoPorCodigo(barcode);
});
```

---

## 🛒 ¿Cómo Usar el Escáner en Ventas?

### Paso 1: Conectar el Escáner

1. Conecta tu escáner USB o empareja por Bluetooth
2. Verifica que funcione escribiendo en un bloc de notas
3. Debería escribir el código y presionar Enter automáticamente

### Paso 2: Usar en la Aplicación

1. Ve a **Ventas** → **Nueva Venta**
2. Haz click en el botón **"Escanear"** (opcional, solo informativo)
3. **Escanea el código de barras** del producto
4. El producto se agregará automáticamente al carrito

### Flujo Completo:

```
Usuario escanea código "123456789"
    ↓
Hook detecta entrada rápida
    ↓
Llama a buscarProductoPorCodigo("123456789")
    ↓
Backend busca: GET /products/products/lookup_by_barcode/?barcode=123456789
    ↓
Producto encontrado
    ↓
Se agrega al carrito automáticamente
    ↓
Muestra alerta: "Producto agregado: Laptop HP"
```

---

## 🎯 Configuración del Escáner

### Configuración Recomendada:

La mayoría de escáneres vienen configurados correctamente, pero verifica:

1. **Sufijo**: Debe enviar "Enter" o "Tab" al final
2. **Prefijo**: No debe tener prefijo
3. **Velocidad**: Rápida (para que el hook lo detecte)

### Configurar en el Escáner:

Consulta el manual de tu escáner para:
- Activar "Enter" al final (CR/LF)
- Desactivar prefijos
- Ajustar velocidad de escaneo

---

## 🔍 Tipos de Códigos Soportados

### Códigos 1D (Barras):
- ✅ EAN-13 (más común en productos)
- ✅ UPC-A
- ✅ Code 128
- ✅ Code 39

### Códigos 2D:
- ✅ QR Code
- ✅ Data Matrix

---

## 🧪 Probar sin Escáner Físico

### Opción 1: Simulación Manual

1. Ve a Ventas
2. Escribe rápidamente un código (ej: "123456789")
3. Presiona Enter rápidamente
4. Si escribes lo suficientemente rápido, el hook lo detectará

### Opción 2: Usar App de Escáner en Móvil

Hay apps que convierten tu teléfono en escáner:
- **Barcode to PC** (Android/iOS)
- **Socket Mobile** (iOS)
- Conectan por WiFi y simulan teclado

### Opción 3: Escáner Virtual

Algunos programas permiten usar la webcam como escáner:
- **QuaggaJS** (JavaScript)
- **ZXing** (Multiplataforma)

---

## ⚙️ Configuración Avanzada

### Archivo: `.env`

```env
# Longitud mínima del código
VITE_BARCODE_MIN_LENGTH=3

# Longitud máxima del código
VITE_BARCODE_MAX_LENGTH=20

# Tiempo máximo entre caracteres (ms)
VITE_BARCODE_TIMEOUT=100
```

### Personalizar el Hook:

```javascript
// En Ventas.jsx
const { isScanning } = useBarcodeScanner(
  async (barcode) => {
    console.log('Código:', barcode);
    await buscarProductoPorCodigo(barcode);
  },
  {
    minLength: 5,        // Mínimo 5 caracteres
    maxLength: 15,       // Máximo 15 caracteres
    timeout: 150,        // 150ms entre teclas
    preventDefault: true // Prevenir comportamiento por defecto
  }
);
```

---

## 🐛 Solución de Problemas

### El escáner no funciona

**Problema**: El hook no detecta el escaneo

**Soluciones**:
1. Verifica que el escáner envíe Enter al final
2. Aumenta el `timeout` en `.env`:
   ```env
   VITE_BARCODE_TIMEOUT=200
   ```
3. Verifica que el código tenga la longitud correcta

### Se detectan teclas normales como escaneo

**Problema**: Al escribir normal se activa el escáner

**Solución**: Reduce el `timeout`:
```env
VITE_BARCODE_TIMEOUT=50
```

### El producto no se encuentra

**Problema**: Código escaneado pero producto no existe

**Soluciones**:
1. Verifica que el producto tenga código de barras en la BD
2. Verifica que el código coincida exactamente
3. Revisa la consola para ver el código escaneado

---

## 📊 Ejemplo Completo

### 1. Agregar Código de Barras a Producto

```sql
-- En la base de datos
UPDATE productos 
SET codigo_barras = '7501234567890' 
WHERE id = 1;
```

### 2. Escanear en la Aplicación

```
Usuario escanea: 7501234567890
    ↓
Hook detecta: "7501234567890"
    ↓
API: GET /products/products/lookup_by_barcode/?barcode=7501234567890
    ↓
Respuesta: { id: 1, nombre: "Laptop HP", precio: 1299, ... }
    ↓
Agrega al carrito
    ↓
Alert: "Producto agregado: Laptop HP"
```

---

## 🎓 Mejores Prácticas

### 1. Códigos Únicos
- Cada producto debe tener un código único
- Usa códigos EAN-13 estándar cuando sea posible

### 2. Validación
- Valida que el código exista antes de agregar
- Verifica stock disponible
- Muestra mensajes claros al usuario

### 3. Feedback Visual
- Muestra indicador cuando está escaneando
- Alerta cuando se agrega producto
- Sonido de confirmación (opcional)

### 4. Manejo de Errores
- Producto no encontrado → Mensaje claro
- Sin stock → Advertencia
- Error de red → Reintentar

---

## 🔗 Recursos Adicionales

### Escáneres Recomendados:
- **Honeywell Voyager 1200g** - USB, económico
- **Zebra DS2208** - USB/Bluetooth, robusto
- **Symbol LS2208** - USB, confiable

### Apps Móviles:
- **Barcode to PC** - Convierte móvil en escáner
- **Socket Mobile** - Escáneres Bluetooth

### Librerías JavaScript:
- **QuaggaJS** - Escáner con webcam
- **ZXing** - Lector multiplataforma
- **html5-qrcode** - QR con cámara

---

## 💡 Tips y Trucos

### Tip 1: Prueba Rápida
```javascript
// En la consola del navegador
window.addEventListener('keypress', (e) => {
  console.log('Tecla:', e.key, 'Tiempo:', Date.now());
});
// Escanea y verás la velocidad
```

### Tip 2: Debug Mode
```javascript
// En useBarcodeScanner.js, agrega:
console.log('Buffer actual:', buffer);
console.log('Tiempo entre teclas:', timeDiff);
```

### Tip 3: Sonido de Confirmación
```javascript
const beep = () => {
  const audio = new Audio('data:audio/wav;base64,...');
  audio.play();
};

// Después de agregar al carrito
beep();
```

---

## ✅ Checklist de Implementación

- [ ] Escáner físico conectado y funcionando
- [ ] Productos tienen códigos de barras en BD
- [ ] Hook `useBarcodeScanner` configurado
- [ ] Endpoint `/lookup_by_barcode/` funciona
- [ ] Probado con varios productos
- [ ] Manejo de errores implementado
- [ ] Feedback visual al usuario
- [ ] Documentación para usuarios finales

---

¡Listo para escanear! 📱✨
