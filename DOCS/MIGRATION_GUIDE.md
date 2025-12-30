# 🔄 Guía de Migración - Base de Datos Reorganizada

## 📋 Resumen de Cambios

Tu base de datos ha sido completamente reorganizada con una estructura profesional y escalable:

### ✅ Antes
- ❌ Una sola colección `products` sin estructura
- ❌ Sin usuarios ni autenticación
- ❌ Sin gestión de órdenes
- ❌ Categorías como strings simples
- ❌ Sin validaciones consistentes

### ✅ Ahora
- ✅ 4 colecciones organizadas: `users`, `categories`, `products`, `orders`
- ✅ Sistema de autenticación con JWT
- ✅ Roles de usuario (admin/normal)
- ✅ Gestión completa de órdenes
- ✅ Categorías como entidades separadas
- ✅ Validaciones estrictas en todos los modelos
- ✅ Relaciones entre colecciones
- ✅ Soft delete para mantener historial

---

## 🚀 Pasos para Migrar

### 1. Instalar Nuevas Dependencias

```bash
npm install
```

Esto instalará:
- `bcryptjs` - Para hashear contraseñas
- `jsonwebtoken` - Para autenticación JWT

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu-secreto-super-seguro-aqui
MP_ACCESS_TOKEN=tu_token_de_mercadopago
PORT=5000
```

### 3. Ejecutar Migración

```bash
npm run migrate
```

Este script:
1. ✅ Lee tu `catalog.json` actual
2. ✅ Crea las categorías únicas
3. ✅ Migra todos los productos a la nueva estructura
4. ✅ Crea un usuario administrador por defecto
5. ✅ Mantiene tus datos existentes

**Salida esperada:**
```
🔄 Iniciando migración de base de datos...
✅ Conectado a MongoDB

📁 Creando categorías...
  ✓ Categoría creada: Remeras
  ✓ Categoría creada: Pantalones
  ✓ Categoría creada: Zapatos
✅ 3 categorías procesadas

📦 Migrando productos...
  ✓ Producto migrado: Remera Roja
  ✓ Producto migrado: Remera Amarilla
  ...
✅ Productos migrados: 21

👤 Creando usuario administrador...
✅ Usuario administrador creado
   Email: admin@almendra.com
   Password: admin123
   ⚠️  CAMBIAR LA CONTRASEÑA EN PRODUCCIÓN

✅ ¡Migración completada exitosamente!
```

### 4. Reemplazar app.js

**Opción A: Backup y reemplazo**
```bash
# Hacer backup del archivo antiguo
mv app.js app-old.js

# Usar el nuevo
mv app-new.js app.js
```

**Opción B: Revisar cambios manualmente**
Compara `app.js` con `app-new.js` y aplica los cambios que necesites.

### 5. Iniciar el Servidor

```bash
npm run dev
```

---

## 🧪 Probar la Nueva Estructura

### 1. Login como Administrador

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@almendra.com",
    "password": "admin123"
  }'
```

Respuesta:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@almendra.com",
    "name": "Administrador",
    "role": "admin"
  }
}
```

### 2. Obtener Productos

```bash
curl http://localhost:5000/api/products
```

### 3. Obtener Categorías

```bash
curl http://localhost:5000/api/categories
```

### 4. Crear Producto (requiere token de admin)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Remera Nueva",
    "description": "Remera de algodón premium",
    "price": 2500,
    "category": "ID_DE_CATEGORIA",
    "stock": 30,
    "image": "remera-nueva.png",
    "sizes": ["S", "M", "L"],
    "colors": ["Rojo", "Azul"]
  }'
```

---

## 📊 Verificar en MongoDB

Puedes verificar la nueva estructura en MongoDB Compass o en la terminal:

```bash
mongosh mongodb://localhost:27017/ecommerce
```

```javascript
// Ver colecciones
show collections
// Salida: users, categories, products, orders

// Ver usuarios
db.users.find().pretty()

// Ver categorías
db.categories.find().pretty()

// Ver productos con categoría poblada
db.products.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "categoryInfo"
    }
  }
])
```

---

## 🔧 Solución de Problemas

### Error: "MONGO_URL no está definida"
**Solución:** Asegúrate de tener el archivo `.env` configurado correctamente.

### Error: "Cannot find module 'bcryptjs'"
**Solución:** Ejecuta `npm install`

### Error: "Producto ya existe"
**Solución:** La migración detecta duplicados. Si quieres forzar la recreación, elimina la colección products antes de migrar:
```javascript
db.products.drop()
```

### Los productos no tienen categoría
**Solución:** Verifica que el `catalog.json` tenga el campo `category` en cada producto.

### No puedo hacer login
**Solución:** Verifica que el usuario exista:
```javascript
db.users.findOne({ email: "admin@almendra.com" })
```

Si no existe, ejecuta nuevamente:
```bash
npm run seed
```

---

## 🎯 Próximos Pasos

### 1. Cambiar Contraseñas
```bash
# Conectar a MongoDB
mongosh mongodb://localhost:27017/ecommerce

# Cambiar password del admin (el hash se genera automáticamente al guardar)
db.users.updateOne(
  { email: "admin@almendra.com" },
  { $set: { password: "nueva_contraseña_aqui" } }
)
```

### 2. Actualizar Frontend
Actualiza tu frontend para usar los nuevos endpoints:
- `/api/auth/login` para autenticación
- `/api/products` en lugar de `/api/productos`
- Incluir token JWT en headers: `Authorization: Bearer TOKEN`

### 3. Crear Más Usuarios
Usa el endpoint de registro:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@usuario.com",
    "password": "password123",
    "name": "Nuevo Usuario"
  }'
```

---

## 📚 Documentación Adicional

- Ver `DATABASE_STRUCTURE.md` para detalles de la estructura
- Ver `models/` para los esquemas de Mongoose
- Ver `routes/` para todos los endpoints disponibles
- Ver `middleware/auth.js` para la lógica de autenticación

---

## ⚠️ Importante

1. **Backup**: Antes de migrar en producción, haz un backup completo de tu base de datos
2. **Testing**: Prueba la migración en un ambiente de desarrollo primero
3. **Credenciales**: Cambia las contraseñas por defecto inmediatamente
4. **JWT_SECRET**: Usa un secreto fuerte y único en producción
5. **Compatibilidad**: El endpoint `/api/productos` sigue funcionando para compatibilidad, pero usa `/api/products` en nuevas implementaciones

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs del servidor
2. Verifica la conexión a MongoDB
3. Asegúrate de que todas las dependencias estén instaladas
4. Consulta `DATABASE_STRUCTURE.md` para entender la estructura

¡Buena suerte con la migración! 🚀
