# Conexión con Backend Django

## ✅ Configuración Completada

El frontend ya está configurado para conectarse con el backend Django. Los endpoints están mapeados correctamente.

---

## 🚀 Cómo Iniciar el Sistema Completo

### 1. Iniciar el Backend (Django)

```bash
# Navegar al directorio del backend
cd backend_2Parcial_SI2/smart_sales360

# Activar el entorno virtual (si existe)
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Instalar dependencias (si es primera vez)
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (si es primera vez)
python manage.py createsuperuser

# Iniciar el servidor
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

---

### 2. Iniciar el Frontend (React + Vite)

```bash
# En otra terminal, navegar al frontend
cd frontend_2parcial_si2/smart_sales360

# Instalar dependencias (si es primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5174` (o el puerto que Vite asigne)

---

## 🔌 Endpoints Configurados

### Productos
- **GET** `/products/products/` - Listar todos los productos
- **GET** `/products/products/?search={query}` - Buscar productos
- **GET** `/products/products/lookup_by_barcode/?barcode={code}` - Buscar por código de barras
- **GET** `/products/products/{id}/` - Obtener producto por ID

### Clientes
- **GET** `/clients/` - Listar todos los clientes
- **GET** `/clients/?search={query}` - Buscar clientes
- **POST** `/clients/` - Crear nuevo cliente
- **GET** `/clients/{id}/` - Obtener cliente por ID

### Ventas
- **GET** `/sales/ventas/` - Listar todas las ventas
- **POST** `/sales/ventas/` - Crear nueva venta
- **GET** `/sales/ventas/{id}/` - Obtener venta por ID
- **GET** `/sales/comprobante/{id}/generar_pdf/` - Generar PDF de comprobante

### Dashboard
- **GET** `/sales/dashboard/estadisticas/` - Obtener estadísticas
- **GET** `/sales/historico/` - Obtener historial de ventas
- **GET** `/sales/dashboard/top_productos/` - Obtener productos más vendidos

---

## 📋 Formato de Datos

### Crear Venta (POST /sales/ventas/)

```json
{
  "cliente": 1,
  "metodo_pago": "efectivo",
  "items": [
    {
      "producto": 1,
      "cantidad": 2,
      "precio_unitario": 1299.00
    }
  ]
}
```

### Respuesta de Productos

```json
[
  {
    "id": 1,
    "nombre": "Laptop HP Pavilion",
    "sku": "LAP001",
    "codigo_barras": "123456789",
    "precio_venta": 1299.00,
    "stock_actual": 15,
    "categoria": 1
  }
]
```

### Respuesta de Clientes

```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "telefono": "555-0001",
    "nit": "1234567"
  }
]
```

---

## 🔐 Autenticación

El sistema usa **Token Authentication** de Django REST Framework.

### Login (si está implementado)

```bash
POST /auth/login/
{
  "username": "admin",
  "password": "tu_password"
}
```

**Respuesta:**
```json
{
  "token": "abc123def456..."
}
```

El token se guarda automáticamente en `localStorage` y se envía en todas las peticiones:
```
Authorization: Token abc123def456...
```

---

## 🐛 Troubleshooting

### Error: CORS

Si ves errores de CORS, asegúrate de que el backend tenga configurado:

```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]

# O para desarrollo:
CORS_ALLOW_ALL_ORIGINS = True
```

### Error: Connection Refused

- Verifica que el backend esté corriendo en `http://localhost:8000`
- Verifica que el `.env` del frontend tenga: `VITE_API_URL=http://localhost:8000`

### Error: 404 Not Found

- Verifica que las URLs del backend coincidan con las del frontend
- Revisa los archivos `urls.py` en cada app del backend

### Error: 401 Unauthorized

- Verifica que el token esté guardado en localStorage
- Verifica que el usuario esté autenticado
- Por ahora, puedes comentar temporalmente `permission_classes` en las vistas del backend

---

## 📝 Datos de Prueba

### Poblar la Base de Datos

Si necesitas datos de prueba, el backend tiene un script:

```bash
cd backend_2Parcial_SI2/smart_sales360
python poblar_productos.py
```

Esto creará productos, clientes y categorías de ejemplo.

---

## 🔄 Flujo de Trabajo

1. **Usuario inicia sesión** (si está implementado)
2. **Busca productos** → Frontend llama a `/products/products/?search=laptop`
3. **Agrega al carrito** → Se guarda en estado local
4. **Selecciona cliente** → Frontend llama a `/clients/?search=juan`
5. **Procesa venta** → Frontend envía POST a `/sales/ventas/`
6. **Backend procesa**:
   - Crea la venta
   - Crea los items de venta
   - Actualiza el stock
   - Genera el comprobante
7. **Frontend muestra confirmación** y opción de imprimir

---

## 🎯 Próximos Pasos

1. **Implementar autenticación completa** en el frontend
2. **Agregar manejo de errores más robusto**
3. **Implementar refresh de token**
4. **Agregar validaciones adicionales**
5. **Implementar caché de datos**
6. **Agregar modo offline**

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend Django
3. Verifica que ambos servidores estén corriendo
4. Verifica las URLs en `src/services/api.js`

---

## ✨ Características Implementadas

- ✅ Búsqueda de productos en tiempo real
- ✅ Búsqueda de clientes
- ✅ Gestión de carrito
- ✅ Validación de stock
- ✅ Procesamiento de ventas
- ✅ Generación de comprobantes PDF
- ✅ Historial de ventas con filtros
- ✅ Paginación
- ✅ Fallback a datos mock si falla la API

---

## 🔧 Configuración Avanzada

### Variables de Entorno (.env)

```env
# URL del backend
VITE_API_URL=http://localhost:8000

# Configuración de la app
VITE_APP_NAME=Smart Sales 360
VITE_APP_VERSION=1.0.0

# Paginación
VITE_ITEMS_PER_PAGE=10

# Escáner de código de barras
VITE_BARCODE_MIN_LENGTH=3
VITE_BARCODE_MAX_LENGTH=20
VITE_BARCODE_TIMEOUT=100
```

### Cambiar URL del Backend

Si el backend está en otro servidor:

```env
VITE_API_URL=https://tu-backend.com
```

O si usas un puerto diferente:

```env
VITE_API_URL=http://localhost:3000
```

---

¡Todo listo para trabajar con el backend! 🚀
