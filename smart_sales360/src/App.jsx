import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './components/Login'
import DashboardLayout from './layouts/DashboardLayout'
import ClienteLayout from './layouts/ClienteLayout'
import AdminDashboard from './pages/AdminDashboard'
import Ventas from './pages/Ventas'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios'
import Configuracion from './pages/Configuracion'
import Tienda from './pages/cliente/Tienda'
import Carrito from './pages/cliente/Carrito'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página de Inicio Pública */}
          <Route path="/" element={<Home />} />
          
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Admin - Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="productos" element={<Productos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>

          {/* Rutas Cliente - Protegidas */}
          <Route
            path="/tienda"
            element={
              <ProtectedRoute>
                <ClienteLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Tienda />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="categorias/:categoria" element={<Tienda />} />
            <Route path="ofertas" element={<Tienda />} />
            <Route path="producto/:id" element={<div>Detalle Producto (por implementar)</div>} />
            <Route path="pedidos" element={<div>Mis Pedidos (por implementar)</div>} />
            <Route path="perfil" element={<div>Mi Perfil (por implementar)</div>} />
            <Route path="checkout" element={<div>Checkout (por implementar)</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
