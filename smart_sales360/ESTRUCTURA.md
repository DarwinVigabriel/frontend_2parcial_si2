# Estructura del Frontend - Smart Sales 360

## 📁 Estructura de Archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── Login.jsx       # Página de login
│   └── Login.css
├── layouts/            # Layouts de la aplicación
│   ├── DashboardLayout.jsx  # Layout principal con sidebar y navbar
│   └── DashboardLayout.css
├── pages/              # Páginas de la aplicación
│   ├── AdminDashboard.jsx   # Dashboard del administrador
│   └── AdminDashboard.css
├── App.jsx             # Configuración de rutas
├── App.css
├── index.css           # Estilos globales y variables CSS
└── main.jsx
```

## 🎨 Sistema de Colores

Los colores están definidos en `src/index.css` como variables CSS:

- **Primario**: #8B1E2D (Granate institucional)
- **Primario hover**: #721626
- **Primario suave**: #F8E7E9
- **Secundario**: #0EA5E9 (Azul para enlaces)
- **Fondo app**: #FAFAF7 (Arena)
- **Superficie**: #FFFFFF
- **Borde**: #E7E2DA

## 🚀 Rutas Configuradas

- `/` - Login
- `/dashboard` - Dashboard del administrador (con layout)
  - `/dashboard/ventas` - Gestión de ventas
  - `/dashboard/productos` - Gestión de productos
  - `/dashboard/clientes` - Gestión de clientes
  - `/dashboard/reportes` - Reportes
  - `/dashboard/usuarios` - Gestión de usuarios
  - `/dashboard/configuracion` - Configuración

## 🎯 Características del Dashboard

### Layout (DashboardLayout.jsx)
- **Sidebar colapsable**: Se puede expandir/contraer
- **Navegación**: Menú lateral con iconos
- **Top navbar**: Con notificaciones y menú de usuario
- **Responsive**: Se adapta a móviles y tablets

### Dashboard Admin (AdminDashboard.jsx)
- **4 Cards de estadísticas**: Ventas, clientes, productos, conversión
- **Tabla de ventas recientes**: Con estados y filtros
- **Top productos**: Lista de productos más vendidos
- **Gráfico de ventas**: Visualización mensual
- **Acciones rápidas**: Botones para acciones comunes
- **Selector de rango**: Día, semana, mes, año

## 🔧 Próximos Pasos

1. Conectar con el backend (API calls)
2. Implementar autenticación real
3. Agregar más páginas (Ventas, Productos, etc.)
4. Integrar librería de gráficos (Chart.js o Recharts)
5. Agregar gestión de estado (Context API o Redux)

## 💡 Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📝 Notas

- El login actualmente redirige directamente al dashboard (sin validación)
- Los datos del dashboard son estáticos (mock data)
- El sidebar muestra todos los items, pero algunos roles deberían tener acceso limitado
