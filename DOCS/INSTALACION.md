# 🚀 Guía de Instalación - Nueva Computadora

Esta guía te ayudará a configurar el proyecto desde cero en una nueva computadora.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js (v14 o superior)
```bash
# Verificar instalación
node --version
npm --version
```

**Descargar:** https://nodejs.org/

### 2. MongoDB (v4.4 o superior)
```bash
# Verificar instalación
mongod --version
```

**Descargar:** https://www.mongodb.com/try/download/community

### 3. Git
```bash
# Verificar instalación
git --version
```

**Descargar:** https://git-scm.com/downloads

## 🔧 Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/vadalabau/ecommerceAlmendra.git
cd ecommerceAlmendra
```

### 2. Instalar Dependencias del Backend

```bash
npm install
```

Esto instalará:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- mercadopago
- body-parser

### 3. Instalar Dependencias del Frontend

```bash
cd client
npm install
cd ..
```

Esto instalará:
- react
- react-dom
- axios
- Y otras dependencias de React

### 4. Configurar Variables de Entorno

#### Backend (.env)

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar el template
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion

# Mercado Pago
MP_ACCESS_TOKEN=tu_token_de_mercado_pago
MP_SUCCESS_URL=http://localhost:5000/success
MP_FAILURE_URL=http://localhost:5000/failure
MP_PENDING_URL=http://localhost:5000/pending

# Puerto
PORT=5000
```

#### Frontend (client/.env.local)

Crea un archivo `.env.local` en la carpeta `client`:

```bash
cd client
cp .env.example .env.local
cd ..
```

Edita el archivo `client/.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Iniciar MongoDB

#### Windows
```bash
# Opción 1: Como servicio (si está instalado como servicio)
net start MongoDB

# Opción 2: Manual
mongod --dbpath="C:\data\db"
```

#### macOS/Linux
```bash
# Opción 1: Como servicio
sudo systemctl start mongod

# Opción 2: Manual
mongod --dbpath=/data/db
```

### 6. Inicializar la Base de Datos

#### Opción A: Migrar desde catalog.json (Recomendado)

Si quieres mantener los productos existentes:

```bash
npm run migrate
```

Esto creará:
- ✅ Categorías (Remeras, Pantalones, Zapatos)
- ✅ Productos (23 productos del catalog.json)
- ✅ Usuario admin

#### Opción B: Datos de Prueba (Limpia todo)

Si quieres empezar desde cero con datos de ejemplo:

```bash
npm run seed
```

⚠️ **ADVERTENCIA:** Esto borrará todos los datos existentes.

### 7. Verificar la Instalación

```bash
# Verificar base de datos
npm run verify

# Listar usuarios
node scripts/list-users.js
```

Deberías ver:
- ✅ 3 categorías
- ✅ 21+ productos
- ✅ 1 usuario admin

### 8. Iniciar el Proyecto

#### Terminal 1: Backend
```bash
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB
🚀 Servidor corriendo en http://localhost:5000
```

#### Terminal 2: Frontend (Desarrollo)
```bash
cd client
npm start
```

Deberías ver:
```
Compiled successfully!
Local: http://localhost:3000
```

### 9. Acceder a la Aplicación

Abre tu navegador en:
```
http://localhost:3000
```

### 10. Login Inicial

#### Usuario Admin
```
Email: admin@almendra.com
Password: admin123
```

⚠️ **IMPORTANTE:** Cambia esta contraseña en producción!

## 🧪 Verificación Final

### Checklist de Funcionamiento

- [ ] MongoDB está corriendo
- [ ] Backend inicia sin errores (puerto 5000)
- [ ] Frontend inicia sin errores (puerto 3000)
- [ ] Puedes ver productos en el catálogo
- [ ] Puedes hacer login con admin@almendra.com
- [ ] Puedes agregar productos como admin
- [ ] Puedes registrar nuevos usuarios

### Comandos de Verificación

```bash
# Verificar base de datos
npm run verify

# Listar usuarios
node scripts/list-users.js

# Verificar conexión a MongoDB
node check-db.js
```

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Causa:** MongoDB no está corriendo

**Solución:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Error: "Port 5000 already in use"

**Causa:** Otro proceso está usando el puerto 5000

**Solución:**
```bash
# Cambiar puerto en .env
PORT=5001
```

### Error: "Module not found"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
# Backend
npm install

# Frontend
cd client
npm install
```

### Error: "JWT_SECRET is not defined"

**Causa:** Archivo .env no existe o está mal configurado

**Solución:**
```bash
# Copiar template
cp .env.example .env

# Editar y agregar valores
```

### Frontend muestra pantalla blanca

**Causa:** Frontend no puede conectar con el backend

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica `client/.env.local`:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
3. Recarga con Ctrl + Shift + R

### Productos no cargan

**Causa:** Base de datos vacía

**Solución:**
```bash
# Migrar productos
npm run migrate

# O usar datos de prueba
npm run seed
```

## 📦 Scripts Disponibles

```bash
# Backend
npm start          # Iniciar servidor (producción)
npm run dev        # Iniciar con nodemon (desarrollo)
npm run migrate    # Migrar datos desde catalog.json
npm run seed       # Datos de prueba (borra todo)
npm run verify     # Verificar base de datos
npm run export     # Exportar productos a catalog.json

# Frontend
cd client
npm start          # Iniciar desarrollo
npm run build      # Build para producción
npm test           # Ejecutar tests
```

## 🔐 Seguridad

### Antes de Producción

1. **Cambiar JWT_SECRET**
   ```env
   JWT_SECRET=genera_una_clave_super_segura_y_larga_aqui
   ```

2. **Cambiar contraseña de admin**
   ```bash
   node scripts/fix-admin-password.js
   ```

3. **Configurar CORS**
   ```javascript
   // app.js
   app.use(cors({
     origin: 'https://tu-dominio.com'
   }));
   ```

4. **Variables de entorno de producción**
   ```env
   MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/ecommerce
   MP_SUCCESS_URL=https://tu-dominio.com/success
   MP_FAILURE_URL=https://tu-dominio.com/failure
   ```

## 📚 Documentación Adicional

- `README.md` - Documentación principal
- `QUICK_START.md` - Inicio rápido
- `DATABASE_STRUCTURE.md` - Estructura de la BD
- `API_EXAMPLES.md` - Ejemplos de API
- `MIGRATION_GUIDE.md` - Guía de migración

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs del servidor
2. Verifica que MongoDB esté corriendo
3. Verifica las variables de entorno
4. Ejecuta `npm run verify` para diagnosticar

---

**¡Listo! Tu proyecto debería estar funcionando correctamente!** 🎉

**Última actualización:** Noviembre 6, 2025
