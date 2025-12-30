# 📊 Estructura de Base de Datos - Almendra E-commerce

## 🗂️ Colecciones

### 1. **Users** (Usuarios)
Gestiona los usuarios del sistema con roles y autenticación.

```javascript
{
  _id: ObjectId,
  email: String (único, requerido),
  password: String (hasheado, requerido),
  name: String (requerido),
  role: String (enum: ['admin', 'user'], default: 'user'),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: 'Argentina')
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Características:**
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de email
- ✅ Roles: admin y user
- ✅ Soft delete con `isActive`

---

### 2. **Categories** (Categorías)
Organiza los productos en categorías.

```javascript
{
  _id: ObjectId,
  name: String (único, requerido),
  slug: String (único, auto-generado),
  description: String,
  image: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Características:**
- ✅ Slug auto-generado desde el nombre
- ✅ Soft delete con `isActive`

---

### 3. **Products** (Productos)
Catálogo de productos con relación a categorías.

```javascript
{
  _id: ObjectId,
  name: String (requerido),
  slug: String (único, auto-generado),
  description: String,
  price: Number (requerido, min: 0),
  category: ObjectId (ref: 'Category', requerido),
  stock: Number (default: 0, min: 0),
  image: String (requerido),
  images: [String],
  sizes: [String] (enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  colors: [String],
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Características:**
- ✅ Relación con categorías mediante ObjectId
- ✅ Slug auto-generado
- ✅ Múltiples imágenes, talles y colores
- ✅ Control de stock
- ✅ Productos destacados
- ✅ Índices para búsqueda de texto
- ✅ Soft delete con `isActive`

---

### 4. **Orders** (Órdenes)
Gestiona las órdenes de compra de los usuarios.

```javascript
{
  _id: ObjectId,
  orderNumber: String (único, auto-generado),
  user: ObjectId (ref: 'User', requerido),
  items: [{
    product: ObjectId (ref: 'Product'),
    name: String,
    quantity: Number (min: 1),
    price: Number (min: 0),
    image: String,
    size: String,
    color: String
  }],
  totalAmount: Number (requerido, min: 0),
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'approved', 'rejected', 'refunded']),
  paymentMethod: String (enum: ['mercadopago', 'cash', 'transfer']),
  paymentId: String,
  shippingAddress: {
    name: String (requerido),
    phone: String (requerido),
    street: String (requerido),
    city: String (requerido),
    state: String (requerido),
    zipCode: String (requerido),
    country: String (default: 'Argentina')
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Características:**
- ✅ Número de orden auto-generado (formato: ORD-YYMMDD-0001)
- ✅ Relación con usuarios y productos
- ✅ Estados de orden y pago
- ✅ Dirección de envío completa
- ✅ Integración con Mercado Pago
- ✅ Reducción automática de stock al crear orden

---

## 🔐 Seguridad

### Autenticación
- **JWT (JSON Web Tokens)** para autenticación
- Tokens con expiración de 7 días
- Contraseñas hasheadas con bcrypt (10 rounds)

### Roles y Permisos
- **admin**: Acceso completo (CRUD de productos, categorías, gestión de órdenes)
- **user**: Acceso limitado (ver productos, crear órdenes, ver sus propias órdenes)

---

## 📡 API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `GET /me` - Obtener perfil (requiere auth)
- `PUT /me` - Actualizar perfil (requiere auth)

### Productos (`/api/products`)
- `GET /` - Listar productos (público)
- `GET /:id` - Obtener producto (público)
- `POST /` - Crear producto (admin)
- `PUT /:id` - Actualizar producto (admin)
- `DELETE /:id` - Eliminar producto (admin)

### Categorías (`/api/categories`)
- `GET /` - Listar categorías (público)
- `GET /:id` - Obtener categoría (público)
- `POST /` - Crear categoría (admin)
- `PUT /:id` - Actualizar categoría (admin)
- `DELETE /:id` - Eliminar categoría (admin)

### Órdenes (`/api/orders`)
- `GET /my-orders` - Mis órdenes (requiere auth)
- `GET /` - Todas las órdenes (admin)
- `GET /:id` - Obtener orden (owner o admin)
- `POST /` - Crear orden (requiere auth)
- `PATCH /:id/status` - Actualizar estado (admin)
- `PATCH /:id/payment` - Actualizar pago (admin)

---

## 🚀 Migración

### Desde la estructura antigua

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar .env:**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. **Ejecutar migración:**
```bash
npm run migrate
```

Esto:
- ✅ Crea las categorías desde los productos existentes
- ✅ Migra productos a la nueva estructura
- ✅ Crea usuario administrador por defecto
- ✅ Mantiene los datos existentes

### Seed (datos de prueba)

Para empezar desde cero con datos de ejemplo:

```bash
npm run seed
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los datos existentes.

---

## 📝 Notas Importantes

### Consistencia de Datos
- ✅ Validaciones en el modelo (Mongoose)
- ✅ Validaciones en las rutas (Express)
- ✅ Referencias entre colecciones (populate)
- ✅ Índices para optimizar búsquedas
- ✅ Soft delete para mantener historial

### Mejoras Implementadas
1. **Normalización**: Categorías en tabla separada
2. **Relaciones**: Referencias con ObjectId y populate
3. **Validaciones**: Esquemas estrictos con validadores
4. **Seguridad**: Autenticación JWT y roles
5. **Escalabilidad**: Índices y paginación
6. **Mantenibilidad**: Código modular y organizado

### Credenciales por Defecto
```
Admin:
  Email: admin@almendra.com
  Password: admin123

Usuario:
  Email: usuario@example.com
  Password: user123
```

**⚠️ CAMBIAR EN PRODUCCIÓN**
