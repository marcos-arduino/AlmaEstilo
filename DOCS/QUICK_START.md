# ⚡ Quick Start - Base de Datos Reorganizada

## 🎯 Resumen Ejecutivo

Tu base de datos MongoDB ahora tiene una estructura profesional con:
- ✅ **4 colecciones** organizadas y relacionadas
- ✅ **Sistema de autenticación** con JWT
- ✅ **Roles de usuario** (admin/normal)
- ✅ **Gestión de órdenes** completa
- ✅ **Validaciones** en todos los modelos

---

## 🚀 Inicio Rápido (3 pasos)

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar .env
```bash
cp .env.example .env
```
Edita `.env` con tu MONGO_URL

### 3️⃣ Migrar datos
```bash
npm run migrate
```

**¡Listo!** Tu base de datos está reorganizada.

---

## 📁 Nueva Estructura de Archivos

```
ecommerceAlmendra/
├── models/                    # 🆕 Modelos de Mongoose
│   ├── User.js               # Usuarios con auth
│   ├── Category.js           # Categorías
│   ├── Product.js            # Productos mejorados
│   ├── Order.js              # Órdenes de compra
│   └── index.js              # Export centralizado
│
├── routes/                    # 🆕 Rutas organizadas
│   ├── auth.js               # Login, registro, perfil
│   ├── products.js           # CRUD productos
│   ├── categories.js         # CRUD categorías
│   └── orders.js             # Gestión de órdenes
│
├── middleware/                # 🆕 Middlewares
│   └── auth.js               # Autenticación JWT
│
├── scripts/                   # 🆕 Scripts útiles
│   ├── migrate.js            # Migrar datos existentes
│   └── seed.js               # Datos de prueba
│
├── app-new.js                # 🆕 Servidor actualizado
├── app.js                    # ⚠️ Antiguo (hacer backup)
└── catalog.json              # Tus datos originales
```

---

## 🗄️ Estructura de Base de Datos

```
MongoDB: ecommerce
│
├── 👥 users
│   ├── email (único)
│   ├── password (hasheado)
│   ├── name
│   ├── role (admin/user)
│   └── address
│
├── 📁 categories
│   ├── name (único)
│   ├── slug (auto-generado)
│   └── description
│
├── 📦 products
│   ├── name
│   ├── slug (auto-generado)
│   ├── price
│   ├── category → categories._id
│   ├── stock
│   ├── images[]
│   ├── sizes[]
│   └── colors[]
│
└── 🛒 orders
    ├── orderNumber (auto-generado)
    ├── user → users._id
    ├── items[]
    │   └── product → products._id
    ├── totalAmount
    ├── status
    ├── paymentStatus
    └── shippingAddress
```

---

## 🔑 Credenciales por Defecto

Después de ejecutar `npm run migrate`:

```
👤 Admin:
   Email: admin@almendra.com
   Password: admin123

👤 Usuario (solo con seed):
   Email: usuario@example.com
   Password: user123
```

**⚠️ CAMBIAR EN PRODUCCIÓN**

---

## 📡 Endpoints Principales

### Autenticación
```bash
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Login (devuelve JWT)
GET  /api/auth/me          # Perfil (requiere token)
```

### Productos
```bash
GET    /api/products       # Listar (público)
GET    /api/products/:id   # Ver uno (público)
POST   /api/products       # Crear (admin)
PUT    /api/products/:id   # Actualizar (admin)
DELETE /api/products/:id   # Eliminar (admin)
```

### Categorías
```bash
GET    /api/categories     # Listar (público)
POST   /api/categories     # Crear (admin)
```

### Órdenes
```bash
GET  /api/orders/my-orders # Mis órdenes (auth)
POST /api/orders           # Crear orden (auth)
GET  /api/orders           # Todas (admin)
```

---

## 🧪 Ejemplo de Uso

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@almendra.com","password":"admin123"}'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@almendra.com",
    "role": "admin"
  }
}
```

### 2. Crear Producto (con token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "name": "Remera Premium",
    "price": 3000,
    "category": "ID_CATEGORIA",
    "stock": 50,
    "image": "remera.png"
  }'
```

---

## 🔄 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar con nodemon

# Producción
npm start                # Iniciar servidor

# Base de datos
npm run migrate          # Migrar datos existentes
npm run seed             # Datos de prueba (⚠️ borra todo)

# MongoDB
mongosh mongodb://localhost:27017/ecommerce
```

---

## 📊 Verificar Migración

```javascript
// En mongosh
use ecommerce

// Ver colecciones
show collections
// → users, categories, products, orders

// Contar documentos
db.users.countDocuments()
db.categories.countDocuments()
db.products.countDocuments()

// Ver un producto con categoría
db.products.findOne()
```

---

## ⚙️ Configuración .env

```env
# Requerido
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=cambiar-en-produccion

# Opcional
PORT=5000
NODE_ENV=development

# Mercado Pago (opcional)
MP_ACCESS_TOKEN=tu_token
MP_SUCCESS_URL=http://localhost:3000/success
```

---

## 🎨 Frontend - Cambios Necesarios

### Antes
```javascript
// Login no existía
fetch('/api/productos')
```

### Ahora
```javascript
// 1. Login
const { token } = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
}).then(r => r.json())

// 2. Guardar token
localStorage.setItem('token', token)

// 3. Usar en requests
fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🆘 Problemas Comunes

### "Cannot find module 'bcryptjs'"
```bash
npm install
```

### "MONGO_URL no está definida"
```bash
cp .env.example .env
# Editar .env
```

### "Producto ya existe"
Es normal, la migración no duplica productos.

### No puedo hacer login
```bash
npm run seed  # Recrear usuarios
```

---

## 📚 Documentación Completa

- `MIGRATION_GUIDE.md` - Guía detallada de migración
- `DATABASE_STRUCTURE.md` - Estructura completa de BD
- `models/` - Ver esquemas de datos
- `routes/` - Ver todos los endpoints

---

## ✅ Checklist Post-Migración

- [ ] Ejecutar `npm install`
- [ ] Configurar `.env`
- [ ] Ejecutar `npm run migrate`
- [ ] Probar login: `admin@almendra.com / admin123`
- [ ] Verificar productos en `/api/products`
- [ ] Cambiar contraseña de admin
- [ ] Actualizar frontend para usar nuevos endpoints
- [ ] Configurar JWT_SECRET en producción

---

## 🎉 ¡Listo!

Tu base de datos ahora es:
- ✅ Profesional y escalable
- ✅ Segura con autenticación
- ✅ Organizada con relaciones
- ✅ Validada en todos los niveles
- ✅ Lista para producción

**Siguiente paso:** Actualiza tu frontend para usar los nuevos endpoints con autenticación JWT.
