import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import auditService from '../services/auditService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Cargar datos del dashboard
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getStats(timeRange);
        setDashboardData(data);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        // Usar datos mock si falla
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [timeRange]);

  // Registrar vista del dashboard
  useEffect(() => {
    auditService.logView('DASHBOARD', 'Acceso al dashboard principal');
  }, []);

  // Datos de ejemplo (fallback)
  const stats = dashboardData ? [
    {
      title: 'Ventas Totales',
      value: `$${dashboardData.ventas_totales?.toLocaleString() || '0'}`,
      change: dashboardData.cambio_ventas || '+0%',
      trend: dashboardData.cambio_ventas?.startsWith('+') ? 'up' : 'down',
      icon: 'dollar',
      color: 'primary'
    },
    {
      title: 'Nuevos Clientes',
      value: dashboardData.nuevos_clientes || '0',
      change: dashboardData.cambio_clientes || '+0%',
      trend: dashboardData.cambio_clientes?.startsWith('+') ? 'up' : 'down',
      icon: 'users',
      color: 'secondary'
    },
    {
      title: 'Productos Vendidos',
      value: dashboardData.productos_vendidos || '0',
      change: dashboardData.cambio_productos || '+0%',
      trend: dashboardData.cambio_productos?.startsWith('+') ? 'up' : 'down',
      icon: 'box',
      color: 'success'
    },
    {
      title: 'Tasa de Conversión',
      value: `${dashboardData.tasa_conversion || '0'}%`,
      change: dashboardData.cambio_conversion || '+0%',
      trend: dashboardData.cambio_conversion?.startsWith('+') ? 'up' : 'down',
      icon: 'chart',
      color: 'warning'
    }
  ] : [
    {
      title: 'Ventas Totales',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: 'dollar',
      color: 'primary'
    },
    {
      title: 'Nuevos Clientes',
      value: '2,345',
      change: '+15.3%',
      trend: 'up',
      icon: 'users',
      color: 'secondary'
    },
    {
      title: 'Productos Vendidos',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: 'box',
      color: 'success'
    },
    {
      title: 'Tasa de Conversión',
      value: '3.2%',
      change: '-2.4%',
      trend: 'down',
      icon: 'chart',
      color: 'warning'
    }
  ];

  const recentSales = [
    { id: 1, customer: 'Juan Pérez', product: 'Laptop HP', amount: '$1,299', status: 'completed', date: '2024-11-13' },
    { id: 2, customer: 'María García', product: 'Mouse Logitech', amount: '$45', status: 'completed', date: '2024-11-13' },
    { id: 3, customer: 'Carlos López', product: 'Teclado Mecánico', amount: '$120', status: 'pending', date: '2024-11-12' },
    { id: 4, customer: 'Ana Martínez', product: 'Monitor Samsung', amount: '$350', status: 'completed', date: '2024-11-12' },
    { id: 5, customer: 'Pedro Sánchez', product: 'Webcam HD', amount: '$89', status: 'cancelled', date: '2024-11-11' },
  ];

  const topProducts = [
    { name: 'Laptop HP Pavilion', sales: 145, revenue: '$188,355', trend: 'up' },
    { name: 'Mouse Logitech MX', sales: 234, revenue: '$10,530', trend: 'up' },
    { name: 'Teclado Mecánico RGB', sales: 189, revenue: '$22,680', trend: 'down' },
    { name: 'Monitor Samsung 27"', sales: 98, revenue: '$34,300', trend: 'up' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      dollar: <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      users: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      box: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
      chart: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    };
    return icons[iconName];
  };

  return (
    <div className="admin-dashboard">
      {/* Header con filtros */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Resumen General</h2>
          <p className="dashboard-subtitle">Monitorea el rendimiento de tu negocio</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={`range-btn ${timeRange === 'day' ? 'active' : ''}`}
            onClick={() => {
              setTimeRange('day');
              auditService.log('VIEW', 'DASHBOARD', 'Cambió vista a: Hoy');
            }}
          >
            Hoy
          </button>
          <button 
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => {
              setTimeRange('week');
              auditService.log('VIEW', 'DASHBOARD', 'Cambió vista a: Semana');
            }}
          >
            Semana
          </button>
          <button 
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => {
              setTimeRange('month');
              auditService.log('VIEW', 'DASHBOARD', 'Cambió vista a: Mes');
            }}
          >
            Mes
          </button>
          <button 
            className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => {
              setTimeRange('year');
              auditService.log('VIEW', 'DASHBOARD', 'Cambió vista a: Año');
            }}
          >
            Año
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {loading && (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#6b7280'}}>
            Cargando datos...
          </div>
        )}
        {!loading && stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {getIcon(stat.icon)}
                </svg>
              </div>
              <span className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              </span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Grid */}
      <div className="content-grid">
        {/* Recent Sales */}
        <div className="card recent-sales-card">
          <div className="card-header">
            <h3 className="card-title">Ventas Recientes</h3>
            <button 
              className="view-all-btn"
              onClick={() => {
                auditService.logView('VENTAS', 'Acceso desde dashboard - Ver todas las ventas');
                navigate('/dashboard/ventas');
              }}
            >
              Ver todas
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {sale.customer.charAt(0)}
                        </div>
                        <span>{sale.customer}</span>
                      </div>
                    </td>
                    <td>{sale.product}</td>
                    <td className="amount">{sale.amount}</td>
                    <td>
                      <span className={`status-badge status-${sale.status}`}>
                        {sale.status === 'completed' ? 'Completado' : 
                         sale.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="date">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card top-products-card">
          <div className="card-header">
            <h3 className="card-title">Productos Más Vendidos</h3>
            <button 
              className="view-all-btn"
              onClick={() => {
                auditService.logView('PRODUCTOS', 'Acceso desde dashboard - Ver todos los productos');
                navigate('/dashboard/productos');
              }}
            >
              Ver todos
            </button>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">#{index + 1}</div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-stats">
                    <span className="product-sales">{product.sales} ventas</span>
                    <span className="product-revenue">{product.revenue}</span>
                  </div>
                </div>
                <div className={`product-trend trend-${product.trend}`}>
                  {product.trend === 'up' ? '↑' : '↓'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Ventas por Mes</h3>
            <select className="chart-select">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{height: '60%'}}><span>Ene</span></div>
              <div className="bar" style={{height: '75%'}}><span>Feb</span></div>
              <div className="bar" style={{height: '55%'}}><span>Mar</span></div>
              <div className="bar" style={{height: '85%'}}><span>Abr</span></div>
              <div className="bar" style={{height: '70%'}}><span>May</span></div>
              <div className="bar" style={{height: '90%'}}><span>Jun</span></div>
              <div className="bar" style={{height: '65%'}}><span>Jul</span></div>
              <div className="bar" style={{height: '80%'}}><span>Ago</span></div>
              <div className="bar" style={{height: '75%'}}><span>Sep</span></div>
              <div className="bar" style={{height: '85%'}}><span>Oct</span></div>
              <div className="bar" style={{height: '95%'}}><span>Nov</span></div>
              <div className="bar" style={{height: '70%'}}><span>Dic</span></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card actions-card">
          <div className="card-header">
            <h3 className="card-title">Acciones Rápidas</h3>
          </div>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => {
              auditService.logView('VENTAS', 'Acceso rápido desde dashboard');
              navigate('/dashboard/ventas');
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Nueva Venta
            </button>
            <button className="action-btn" onClick={() => {
              auditService.logView('CLIENTES', 'Acceso rápido desde dashboard');
              navigate('/dashboard/clientes');
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Nuevo Cliente
            </button>
            <button className="action-btn" onClick={() => {
              auditService.logView('PRODUCTOS', 'Acceso rápido desde dashboard');
              navigate('/dashboard/productos');
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Nuevo Producto
            </button>
            <button className="action-btn" onClick={() => {
              auditService.logView('BITACORA', 'Acceso rápido desde dashboard');
              navigate('/dashboard/bitacora');
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Ver Bitácora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
