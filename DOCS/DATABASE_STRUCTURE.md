# 📊 Estructura de Base de Datos - AlmaEstilo

## 🗂️ Colecciones Principales

### 1. **Users** (Usuarios)
Gestiona los usuarios del sistema con autenticación y perfiles.

```javascript
{
  _id: ObjectId,
  firstName: String (requerido),
  lastName: String (requerido),
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un correo válido']
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false
  },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'editor'], 
    default: 'user' 
  },
  phone: {
    type: String,
    match: [/^[0-9\-\+\(\)\s]+$/, 'Número de teléfono inválido']
  },
  address: [{
    type: {
      street: String,
      number: String,
      apartment: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Argentina' },
      isDefault: { type: Boolean, default: false }
    }
  }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Características:**
- 🔐 Autenticación segura con JWT
- 🔄 Verificación de correo electrónico
- 🔑 Recuperación de contraseña
- 👥 Múltiples roles: admin, editor, user
- 🏠 Múltiples direcciones de envío
- ❤️ Lista de deseos
- 🔒 Protección contra ataques de fuerza bruta
- 📧 Notificaciones por correo electrónico

---

### 2. **Categories** (Categorías)
Organiza jerárquicamente los productos en categorías y subcategorías.

```javascript
{
  _id: ObjectId,
  name: { 
    type: String, 
    required: [true, 'El nombre de la categoría es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    slug: String
  }],
  image: {
    url: String,
    alt: String
  },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Características:**
- 🌳 Estructura jerárquica ilimitada
- 🔗 URLs amigables con slugs únicos
- 🖼️ Soporte para imágenes destacadas
- 🔍 Optimización SEO
- 🏷️ Categorías destacadas
- 📊 Ordenamiento personalizado
```

**Características:**

---

### 3. **Products** (Productos)
Catálogo completo de productos con variantes y atributos.

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [2000, 'La descripción no puede exceder los 2000 caracteres']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'La descripción corta no puede exceder los 300 caracteres']
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  price: {
    base: { type: Number, required: true, min: 0 },
    sale: { type: Number, min: 0 },
    currency: { type: String, default: 'ARS' },
    taxRate: { type: Number, default: 0.21 } // 21% IVA por defecto
  },
  cost: {
    type: Number,
    min: 0,
    required: [true, 'El costo es requerido para el cálculo de márgenes']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'El stock debe ser un número entero'
    }
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  weight: { type: Number, default: 0 }, // en gramos
  dimensions: {
    length: Number, // cm
    width: Number,  // cm
    height: Number, // cm
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Al menos una categoría es requerida']
  }],
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  attributes: [{
    name: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    displayValue: String
  }],
  variants: [{
    sku: { type: String, required: true, unique: true },
    attributes: [{
      name: String,
      value: String,
      displayValue: String
    }],
    price: Number,
    stock: Number,
    images: [{
      url: String,
      alt: String,
      isDefault: Boolean
    }],
    barcode: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  }],
  images: [{
    url: { type: String, required: true },
    alt: String,
    isDefault: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  specifications: [{
    name: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: String
  }],
  relatedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  isDigital: { type: Boolean, default: false },
  downloadUrl: String,
  seo: {
    title: String,
    description: String,
    keywords: [String],
    canonicalUrl: String
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  viewCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: Date
}
```

**Características:**
- Relación con categorías mediante ObjectId
- Slug auto-generado
- Múltiples imágenes, talles y colores
- Control de stock
- Productos destacados
- Índices para búsqueda de texto
- Soft delete con `isActive`

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
