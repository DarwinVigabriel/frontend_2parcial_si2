// Catálogo centralizado de productos - Smart Sales 365
// Este archivo se usa tanto en la vista de administrador como en la tienda del cliente

const productos = [
  // LAPTOPS (1-5)
  {
    id: 1,
    sku: 'LAP001',
    codigo: '123456789',
    nombre: 'Laptop HP Pavilion 15"',
    descripcion: 'Laptop HP Pavilion con procesador Intel Core i5, 8GB RAM, 256GB SSD',
    precio: 4500,
    precioAnterior: 5200,
    imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    categoria: 'Computación',
    stock: 15,
    descuento: 13
  },
  {
    id: 2,
    sku: 'LAP002',
    codigo: '123456790',
    nombre: 'MacBook Air M2 13"',
    descripcion: 'MacBook Air con chip M2, 8GB RAM, 256GB SSD',
    precio: 8500,
    precioAnterior: 9200,
    imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    categoria: 'Computación',
    stock: 8,
    descuento: 8
  },
  {
    id: 3,
    sku: 'LAP003',
    codigo: '123456791',
    nombre: 'Dell XPS 15 Touch',
    descripcion: 'Dell XPS 15 con pantalla táctil 4K, Intel i7, 16GB RAM',
    precio: 7200,
    imagen: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
    categoria: 'Computación',
    stock: 12
  },
  {
    id: 4,
    sku: 'LAP004',
    codigo: '123456792',
    nombre: 'Lenovo ThinkPad X1',
    descripcion: 'Lenovo ThinkPad X1 Carbon, Intel i7, 16GB RAM, 512GB SSD',
    precio: 6800,
    precioAnterior: 7500,
    imagen: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    categoria: 'Computación',
    stock: 10,
    descuento: 9
  },
  {
    id: 5,
    sku: 'LAP005',
    codigo: '123456793',
    nombre: 'ASUS ROG Gaming Laptop',
    descripcion: 'ASUS ROG con RTX 3060, Intel i7, 16GB RAM, 1TB SSD',
    precio: 9500,
    imagen: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
    categoria: 'Computación',
    stock: 6
  },
  // PERIFÉRICOS - MOUSE (6-10)
  {
    id: 6,
    sku: 'MOU001',
    codigo: '987654321',
    nombre: 'Mouse Logitech MX Master 3',
    descripcion: 'Mouse inalámbrico ergonómico con sensor de alta precisión',
    precio: 350,
    imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 50
  },
  {
    id: 7,
    sku: 'MOU002',
    codigo: '987654322',
    nombre: 'Mouse Razer DeathAdder',
    descripcion: 'Mouse gaming con RGB y 16000 DPI',
    precio: 280,
    precioAnterior: 350,
    imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 35,
    descuento: 20
  },
  {
    id: 8,
    sku: 'MOU003',
    codigo: '987654323',
    nombre: 'Mouse Apple Magic Mouse',
    descripcion: 'Mouse inalámbrico recargable con superficie Multi-Touch',
    precio: 420,
    imagen: 'https://images.unsplash.com/photo-1586920740099-e6e8e1b8e3c6?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 25
  },
  {
    id: 9,
    sku: 'MOU004',
    codigo: '987654324',
    nombre: 'Mouse Logitech G502',
    descripcion: 'Mouse gaming con pesos ajustables y 11 botones programables',
    precio: 320,
    precioAnterior: 400,
    imagen: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 40,
    descuento: 20
  },
  {
    id: 10,
    sku: 'MOU005',
    codigo: '987654325',
    nombre: 'Mouse Vertical Ergonómico',
    descripcion: 'Mouse vertical para reducir tensión en la muñeca',
    precio: 180,
    imagen: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 30
  },
  // TECLADOS (11-15)
  {
    id: 11,
    sku: 'TEC001',
    codigo: '456789123',
    nombre: 'Teclado Mecánico RGB Gaming',
    descripcion: 'Teclado mecánico con switches Cherry MX e iluminación RGB',
    precio: 580,
    precioAnterior: 720,
    imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 25,
    descuento: 19
  },
  {
    id: 12,
    sku: 'TEC002',
    codigo: '456789124',
    nombre: 'Teclado Apple Magic Keyboard',
    descripcion: 'Teclado inalámbrico recargable con diseño compacto',
    precio: 480,
    imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 20
  },
  {
    id: 13,
    sku: 'TEC003',
    codigo: '456789125',
    nombre: 'Teclado Logitech K380',
    descripcion: 'Teclado Bluetooth multi-dispositivo compacto',
    precio: 220,
    precioAnterior: 280,
    imagen: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 45,
    descuento: 21
  },
  {
    id: 14,
    sku: 'TEC004',
    codigo: '456789126',
    nombre: 'Teclado Corsair K95 RGB',
    descripcion: 'Teclado mecánico gaming premium con teclas macro',
    precio: 850,
    imagen: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 15
  },
  {
    id: 15,
    sku: 'TEC005',
    codigo: '456789127',
    nombre: 'Teclado Ergonómico Microsoft',
    descripcion: 'Teclado ergonómico dividido para mayor comodidad',
    precio: 380,
    imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    categoria: 'Periféricos',
    stock: 28
  },
  // MONITORES (16-20)
  {
    id: 16,
    sku: 'MON001',
    codigo: '789123456',
    nombre: 'Monitor LG UltraWide 27"',
    descripcion: 'Monitor UltraWide 27" IPS 2560x1080 75Hz',
    precio: 1850,
    imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    categoria: 'Monitores',
    stock: 10
  },
  {
    id: 17,
    sku: 'MON002',
    codigo: '789123457',
    nombre: 'Monitor Samsung 55" 4K',
    descripcion: 'Smart TV Samsung 55" 4K UHD con HDR',
    precio: 3500,
    precioAnterior: 4200,
    imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    categoria: 'Monitores',
    stock: 8,
    descuento: 17
  },
  {
    id: 18,
    sku: 'MON003',
    codigo: '789123458',
    nombre: 'Monitor Dell 24" Full HD',
    descripcion: 'Monitor Dell 24" IPS Full HD con ajuste de altura',
    precio: 980,
    imagen: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop',
    categoria: 'Monitores',
    stock: 18
  },
  {
    id: 19,
    sku: 'MON004',
    codigo: '789123459',
    nombre: 'Monitor ASUS ROG 27" 144Hz',
    descripcion: 'Monitor gaming 27" QHD 144Hz con G-Sync',
    precio: 2200,
    precioAnterior: 2600,
    imagen: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=400&h=400&fit=crop',
    categoria: 'Monitores',
    stock: 12,
    descuento: 15
  },
  {
    id: 20,
    sku: 'MON005',
    codigo: '789123460',
    nombre: 'Monitor BenQ 32" 4K',
    descripcion: 'Monitor profesional 32" 4K para diseño gráfico',
    precio: 3200,
    imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    categoria: 'Monitores',
    stock: 6
  }
];

export default productos;
