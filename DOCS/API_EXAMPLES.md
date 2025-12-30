# 🔌 Ejemplos de Uso de la API

## 📝 Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [Productos](#productos)
3. [Categorías](#categorías)
4. [Órdenes](#órdenes)
5. [Ejemplos Frontend](#ejemplos-frontend)

---

## 🔐 Autenticación

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@usuario.com",
    "password": "password123",
    "name": "Juan Pérez",
    "phone": "+54 11 1234-5678",
    "address": {
      "street": "Av. Corrientes 1234",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "1043"
    }
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673abc123def456789",
    "email": "nuevo@usuario.com",
    "name": "Juan Pérez",
    "role": "user"
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@almendra.com",
    "password": "admin123"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673abc123def456789",
    "email": "admin@almendra.com",
    "name": "Administrador",
    "role": "admin"
  }
}
```

### Obtener Perfil
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "user": {
    "id": "673abc123def456789",
    "email": "admin@almendra.com",
    "name": "Administrador",
    "role": "admin",
    "phone": "+54 11 1234-5678",
    "address": {
      "street": "Av. Corrientes 1234",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "1043",
      "country": "Argentina"
    }
  }
}
```

### Actualizar Perfil
```bash
curl -X PUT http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "phone": "+54 11 9999-8888"
  }'
```

---

## 📦 Productos

### Listar Todos los Productos
```bash
curl http://localhost:5000/api/products
```

**Respuesta:**
```json
{
  "products": [
    {
      "_id": "68ffb62cb05c741ab9be0fc0",
      "name": "Remera Roja",
      "slug": "remera-roja",
      "description": "Remera de algodón color rojo, talle M",
      "price": 1500,
      "category": {
        "_id": "68ffb62cb05c741ab9be0fb0",
        "name": "Remeras",
        "slug": "remeras"
      },
      "stock": 20,
      "image": "remeraroja.png",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Rojo"],
      "isActive": true,
      "isFeatured": false
    }
  ],
  "pagination": {
    "total": 21,
    "page": 1,
    "pages": 1
  }
}
```

### Filtrar Productos
```bash
# Por categoría
curl "http://localhost:5000/api/products?category=remeras"

# Por rango de precio
curl "http://localhost:5000/api/products?minPrice=1000&maxPrice=3000"

# Búsqueda por texto
curl "http://localhost:5000/api/products?search=remera+roja"

# Productos destacados
curl "http://localhost:5000/api/products?featured=true"

# Con paginación
curl "http://localhost:5000/api/products?page=2&limit=10"

# Combinado
curl "http://localhost:5000/api/products?category=remeras&minPrice=1000&page=1&limit=20"
```

### Obtener Producto por ID
```bash
curl http://localhost:5000/api/products/68ffb62cb05c741ab9be0fc0
```

### Obtener Producto por Slug
```bash
curl http://localhost:5000/api/products/remera-roja
```

### Crear Producto (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Remera Premium Negra",
    "description": "Remera de algodón premium color negro",
    "price": 2500,
    "category": "68ffb62cb05c741ab9be0fb0",
    "stock": 50,
    "image": "remera-premium-negra.png",
    "images": [
      "remera-premium-negra-1.png",
      "remera-premium-negra-2.png"
    ],
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Negro"],
    "isFeatured": true
  }'
```

### Actualizar Producto (Admin)
```bash
curl -X PUT http://localhost:5000/api/products/68ffb62cb05c741ab9be0fc0 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1800,
    "stock": 15
  }'
```

### Eliminar Producto (Admin)
```bash
curl -X DELETE http://localhost:5000/api/products/68ffb62cb05c741ab9be0fc0 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📁 Categorías

### Listar Categorías
```bash
curl http://localhost:5000/api/categories
```

**Respuesta:**
```json
[
  {
    "_id": "68ffb62cb05c741ab9be0fb0",
    "name": "Remeras",
    "slug": "remeras",
    "description": "Remeras de algodón de alta calidad",
    "isActive": true
  },
  {
    "_id": "68ffb62cb05c741ab9be0fb1",
    "name": "Pantalones",
    "slug": "pantalones",
    "description": "Pantalones cómodos y modernos",
    "isActive": true
  }
]
```

### Obtener Categoría
```bash
# Por ID
curl http://localhost:5000/api/categories/68ffb62cb05c741ab9be0fb0

# Por slug
curl http://localhost:5000/api/categories/remeras
```

### Crear Categoría (Admin)
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accesorios",
    "description": "Accesorios de moda"
  }'
```

### Actualizar Categoría (Admin)
```bash
curl -X PUT http://localhost:5000/api/categories/68ffb62cb05c741ab9be0fb0 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Remeras de algodón premium"
  }'
```

---

## 🛒 Órdenes

### Crear Orden
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "68ffb62cb05c741ab9be0fc0",
        "quantity": 2,
        "size": "M",
        "color": "Rojo"
      },
      {
        "product": "68ffb62cb05c741ab9be0fc1",
        "quantity": 1,
        "size": "L",
        "color": "Azul"
      }
    ],
    "shippingAddress": {
      "name": "Juan Pérez",
      "phone": "+54 11 1234-5678",
      "street": "Av. Corrientes 1234, Piso 5 Depto B",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "1043"
    },
    "notes": "Dejar con portero si no estoy"
  }'
```

**Respuesta:**
```json
{
  "message": "Orden creada exitosamente",
  "order": {
    "_id": "68ffb62cb05c741ab9be0fd0",
    "orderNumber": "ORD-251106-0001",
    "user": "673abc123def456789",
    "items": [
      {
        "product": "68ffb62cb05c741ab9be0fc0",
        "name": "Remera Roja",
        "quantity": 2,
        "price": 1500,
        "image": "remeraroja.png",
        "size": "M",
        "color": "Rojo"
      }
    ],
    "totalAmount": 4500,
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": {
      "name": "Juan Pérez",
      "phone": "+54 11 1234-5678",
      "street": "Av. Corrientes 1234, Piso 5 Depto B",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "1043",
      "country": "Argentina"
    }
  }
}
```

### Mis Órdenes
```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer USER_TOKEN"
```

### Obtener Orden por ID
```bash
curl http://localhost:5000/api/orders/68ffb62cb05c741ab9be0fd0 \
  -H "Authorization: Bearer USER_TOKEN"
```

### Todas las Órdenes (Admin)
```bash
# Todas
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filtrar por estado
curl "http://localhost:5000/api/orders?status=pending" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Con paginación
curl "http://localhost:5000/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Actualizar Estado de Orden (Admin)
```bash
curl -X PATCH http://localhost:5000/api/orders/68ffb62cb05c741ab9be0fd0/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing"
  }'
```

Estados válidos: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### Actualizar Estado de Pago (Admin)
```bash
curl -X PATCH http://localhost:5000/api/orders/68ffb62cb05c741ab9be0fd0/payment \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentStatus": "approved",
    "paymentId": "MP-123456789"
  }'
```

Estados válidos: `pending`, `approved`, `rejected`, `refunded`

---

## 💻 Ejemplos Frontend

### React - Login y Guardar Token
```javascript
import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirigir
        window.location.href = '/dashboard';
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### React - Obtener Productos
```javascript
import { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <img src={`/img/${product.image}`} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button>Agregar al carrito</button>
        </div>
      ))}
    </div>
  );
}
```

### React - Crear Orden
```javascript
function Checkout({ cartItems }) {
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: item._id,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          })),
          shippingAddress
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Orden creada exitosamente!');
        // Limpiar carrito
        localStorage.removeItem('cart');
        // Redirigir a página de pago
        window.location.href = `/order/${data.order._id}`;
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la orden');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre completo"
        value={shippingAddress.name}
        onChange={(e) => setShippingAddress({
          ...shippingAddress,
          name: e.target.value
        })}
        required
      />
      {/* Más campos... */}
      <button type="submit">Finalizar Compra</button>
    </form>
  );
}
```

### React - Hook Personalizado para Auth
```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return { user, loading, logout, isAdmin: user?.role === 'admin' };
}

// Uso
function Dashboard() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>Debes iniciar sesión</div>;

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### JavaScript Vanilla - Fetch con Token
```javascript
// Función helper para hacer requests autenticados
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token inválido o expirado
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return response;
}

// Uso
async function getMyOrders() {
  const response = await fetchWithAuth('http://localhost:5000/api/orders/my-orders');
  const orders = await response.json();
  console.log(orders);
}
```

---

## 🔒 Manejo de Errores

### Errores Comunes

**401 Unauthorized**
```json
{
  "error": "No autorizado - Token no proporcionado"
}
```
Solución: Incluir token en header `Authorization: Bearer TOKEN`

**403 Forbidden**
```json
{
  "error": "Acceso denegado - Se requiere rol de administrador"
}
```
Solución: Endpoint solo para admins

**400 Bad Request**
```json
{
  "error": "Email y contraseña son requeridos"
}
```
Solución: Verificar datos enviados

**404 Not Found**
```json
{
  "error": "Producto no encontrado"
}
```
Solución: Verificar ID o slug

**500 Internal Server Error**
```json
{
  "error": "Error interno del servidor"
}
```
Solución: Revisar logs del servidor

---

## 📱 Postman Collection

Importa esta colección en Postman para probar todos los endpoints:

```json
{
  "info": {
    "name": "Almendra E-commerce API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Guarda el token después del login y úsalo en las siguientes requests.

---

**¡Listo para usar!** 🚀

Para más información, consulta:
- `QUICK_START.md` - Inicio rápido
- `DATABASE_STRUCTURE.md` - Estructura de BD
- `MIGRATION_GUIDE.md` - Guía de migración
