# 🛍️ Almendra E-commerce

E-commerce completo con backend Node.js/Express, MongoDB y autenticación JWT.

## ✨ Características

- ✅ **Autenticación JWT** con roles (admin/user)
- ✅ **Base de datos MongoDB** organizada y normalizada
- ✅ **CRUD completo** de productos, categorías y órdenes
- ✅ **Sistema de órdenes** con gestión de stock
- ✅ **Integración Mercado Pago** para pagos
- ✅ **Validaciones** en todos los niveles
- ✅ **Soft delete** para mantener historial
- ✅ **API RESTful** bien documentada

## 🗂️ Estructura de Base de Datos

```
MongoDB
├── users       # Usuarios con autenticación
├── categories  # Categorías de productos
├── products    # Catálogo de productos
└── orders      # Órdenes de compra
```

Ver [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md) para más detalles.

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd ecommerceAlmendra

# Instalar dependencias
npm install
```

### 2. Configuración

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

Variables requeridas:
```env
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu-secreto-super-seguro
MP_ACCESS_TOKEN=tu_token_mercadopago
```

### 3. Migrar Datos

```bash
# Opción A: Migrar datos existentes
npm run migrate

# Opción B: Crear datos de prueba (⚠️ borra todo)
npm run seed
```

### 4. Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📡 API Endpoints

### Autenticación
```
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Login
GET  /api/auth/me          # Perfil (requiere auth)
PUT  /api/auth/me          # Actualizar perfil
```

### Productos
```
GET    /api/products       # Listar productos
GET    /api/products/:id   # Ver producto
POST   /api/products       # Crear (admin)
PUT    /api/products/:id   # Actualizar (admin)
DELETE /api/products/:id   # Eliminar (admin)
```

### Categorías
```
GET    /api/categories     # Listar categorías
POST   /api/categories     # Crear (admin)
PUT    /api/categories/:id # Actualizar (admin)
```

### Órdenes
```
GET  /api/orders/my-orders # Mis órdenes
POST /api/orders           # Crear orden
GET  /api/orders           # Todas (admin)
PATCH /api/orders/:id/status   # Actualizar estado (admin)
```

Ver [API_EXAMPLES.md](API_EXAMPLES.md) para ejemplos completos.

## 🔑 Credenciales por Defecto

Después de ejecutar `npm run migrate` o `npm run seed`:

```
Admin:
  Email: admin@almendra.com
  Password: admin123

Usuario (solo con seed):
  Email: usuario@example.com
  Password: user123
```

**⚠️ CAMBIAR EN PRODUCCIÓN**

## 🛠️ Scripts Disponibles

```bash
npm start          # Iniciar servidor
npm run dev        # Desarrollo con nodemon
npm run migrate    # Migrar datos existentes
npm run seed       # Datos de prueba (⚠️ borra todo)
npm run verify     # Verificar estructura de BD
```

## 📚 Documentación

- **[QUICK_START.md](QUICK_START.md)** - Inicio rápido en 3 pasos
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guía detallada de migración
- **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** - Estructura completa de BD
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Ejemplos de uso de la API
- **[RESUMEN_REORGANIZACION.md](RESUMEN_REORGANIZACION.md)** - Resumen de cambios

## 🔐 Seguridad

- Contraseñas hasheadas con **bcrypt** (10 rounds)
- Autenticación con **JWT** (expiración 7 días)
- Validaciones estrictas en modelos y rutas
- Control de roles (admin/user)
- Soft delete para mantener historial

## 🏗️ Estructura del Proyecto

```
ecommerceAlmendra/
├── models/              # Modelos de Mongoose
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   └── Order.js
├── routes/              # Rutas de la API
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   └── orders.js
├── middleware/          # Middlewares
│   └── auth.js
├── scripts/             # Scripts útiles
│   ├── migrate.js
│   ├── seed.js
│   └── verify-db.js
├── public/              # Archivos estáticos
│   └── img/
├── client/              # Frontend React
├── app.js               # Servidor Express
└── package.json
```

## 🧪 Verificar Instalación

```bash
# Verificar estructura de BD
npm run verify

# Probar login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@almendra.com","password":"admin123"}'

# Listar productos
curl http://localhost:5000/api/products
```

## 💻 Ejemplo de Uso (Frontend)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@almendra.com', 
    password: 'admin123' 
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);

// Usar token en requests
const products = await fetch('http://localhost:5000/api/products', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});
```

Ver más ejemplos en [API_EXAMPLES.md](API_EXAMPLES.md)

## 🔄 Migración desde Versión Anterior

Si ya tienes datos en la base de datos:

```bash
# 1. Hacer backup
mongodump --db ecommerce --out backup/

# 2. Instalar dependencias
npm install

# 3. Migrar datos
npm run migrate

# 4. Verificar
npm run verify
```

La migración:
- ✅ Mantiene tus productos existentes
- ✅ Crea categorías automáticamente
- ✅ Crea usuario admin por defecto
- ✅ No duplica datos

## 🆘 Solución de Problemas

### "Cannot find module 'bcryptjs'"
```bash
npm install
```

### "MONGO_URL no está definida"
```bash
cp .env.example .env
# Editar .env con tu MONGO_URL
```

### "No puedo hacer login"
```bash
# Recrear usuarios
npm run seed
```

### "Productos sin categoría"
```bash
# Verificar integridad
npm run verify
```

## 📦 Tecnologías

- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB, Mongoose
- **Autenticación**: JWT, bcrypt
- **Pagos**: Mercado Pago SDK
- **Frontend**: React (en /client)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

MIT

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación en `/docs`
2. Ejecuta `npm run verify` para diagnosticar
3. Revisa los logs del servidor
4. Consulta [API_EXAMPLES.md](API_EXAMPLES.md)

---

**Versión:** 2.0  
**Última actualización:** Noviembre 2025

¡Gracias por usar Almendra E-commerce! 🚀
