# 🚀 Guía de Deployment en Render

## 📋 Requisitos Previos

1. Cuenta en [Render.com](https://render.com)
2. Repositorio en GitHub
3. MongoDB Atlas (para base de datos en la nube)

## 🗄️ Paso 1: Configurar MongoDB Atlas

### 1.1 Crear Cluster

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo cluster (Free tier está bien)
4. Espera a que se cree (5-10 minutos)

### 1.2 Configurar Acceso

1. **Database Access:**
   - Crea un usuario de base de datos
   - Guarda el usuario y contraseña

2. **Network Access:**
   - Add IP Address
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - Esto es necesario para que Render pueda conectarse

### 1.3 Obtener Connection String

1. Click en "Connect" en tu cluster
2. Selecciona "Connect your application"
3. Copia el connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
4. Reemplaza `<username>` y `<password>` con tus credenciales

## 🌐 Paso 2: Configurar Render

### 2.1 Crear Web Service

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona `ecommerceAlmendra`

### 2.2 Configuración del Servicio

**Basic Settings:**
- **Name:** `ecommerce-almendra` (o el que prefieras)
- **Region:** Selecciona la más cercana
- **Branch:** `main`
- **Root Directory:** (dejar vacío)
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:**
  ```bash
  npm install && npm --prefix client install && npm --prefix client run build
  ```

- **Start Command:**
  ```bash
  npm start
  ```

**Plan:**
- Selecciona "Free" (o el plan que prefieras)

### 2.3 Variables de Entorno

Click en "Advanced" → "Add Environment Variable"

Agrega las siguientes variables:

```env
# MongoDB (IMPORTANTE: Usar tu connection string de Atlas)
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret (Genera uno seguro)
JWT_SECRET=<genera_una_clave_super_secreta_y_larga_para_produccion>

# Puerto (Render lo asigna automáticamente, pero puedes especificar)
PORT=5000

# Mercado Pago (Opcional, si vas a usar pagos)
MP_ACCESS_TOKEN=tu_token_de_mercado_pago
MP_SUCCESS_URL=https://tu-app.onrender.com/success
MP_FAILURE_URL=https://tu-app.onrender.com/failure
MP_PENDING_URL=https://tu-app.onrender.com/pending

# Node Environment
NODE_ENV=production
```

### 2.4 Deploy

1. Click en "Create Web Service"
2. Render comenzará a hacer el build automáticamente
3. Espera a que termine (puede tomar 5-10 minutos)

## ✅ Paso 3: Verificar Deployment

### 3.1 Verificar Build

En los logs deberías ver:
```
==> Build successful 🎉
==> Deploying...
==> Your service is live 🎉
```

### 3.2 Verificar URL

Render te dará una URL como:
```
https://ecommerce-almendra.onrender.com
```

### 3.3 Probar la Aplicación

1. Abre la URL en tu navegador
2. Deberías ver la pantalla de login
3. Intenta hacer login con:
   ```
   Email: admin@almendra.com
   Password: admin123
   ```

## 🔧 Paso 4: Migrar Datos (Primera vez)

### Opción A: Usar Render Shell

1. En Render Dashboard → tu servicio
2. Click en "Shell" (en el menú lateral)
3. Ejecuta:
   ```bash
   npm run migrate
   ```

### Opción B: Conectar desde tu PC

1. Usa el connection string de MongoDB Atlas
2. En tu PC local:
   ```bash
   # Actualizar .env con el connection string de Atlas
   MONGO_URL=mongodb+srv://...
   
   # Ejecutar migración
   npm run migrate
   ```

## 🐛 Solución de Problemas

### Error: "Build failed - ERESOLVE"

**Causa:** Conflicto de dependencias con i18next

**Solución:** Ya está resuelto con el archivo `client/.npmrc`

Si persiste, actualiza el Build Command a:
```bash
npm install && npm --prefix client install --legacy-peer-deps && npm --prefix client run build
```

### Error: "Cannot connect to MongoDB"

**Causa:** Connection string incorrecto o IP no permitida

**Solución:**
1. Verifica el connection string en las variables de entorno
2. En MongoDB Atlas → Network Access → Permite 0.0.0.0/0
3. Verifica usuario y contraseña

### Error: "Application failed to respond"

**Causa:** Puerto incorrecto

**Solución:**
Asegúrate de que `app.js` use `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### Error: "Module not found"

**Causa:** Dependencias no instaladas

**Solución:**
Verifica que el Build Command incluya:
```bash
npm install && npm --prefix client install
```

### La aplicación se "duerme" después de inactividad

**Causa:** Plan Free de Render

**Solución:**
- El plan Free duerme después de 15 minutos de inactividad
- La primera request después de dormir toma ~30 segundos
- Considera upgrade a plan pago si necesitas 24/7

## 🔄 Actualizar la Aplicación

### Automático (Recomendado)

Render hace auto-deploy cuando haces push a GitHub:

```bash
# En tu PC
git add .
git commit -m "Actualización"
git push origin main

# Render detecta el push y hace deploy automáticamente
```

### Manual

1. En Render Dashboard → tu servicio
2. Click en "Manual Deploy" → "Deploy latest commit"

## 📊 Monitoreo

### Ver Logs

1. Render Dashboard → tu servicio
2. Click en "Logs"
3. Verás logs en tiempo real

### Métricas

1. Render Dashboard → tu servicio
2. Click en "Metrics"
3. Verás CPU, memoria, requests, etc.

## 🔐 Seguridad

### Cambiar Credenciales por Defecto

```bash
# Conectar a Render Shell
# Ejecutar:
node scripts/fix-admin-password.js
```

O actualizar directamente en MongoDB Atlas.

### Variables de Entorno Sensibles

- ✅ Nunca hagas commit de `.env`
- ✅ Usa variables de entorno en Render
- ✅ Genera JWT_SECRET seguro
- ✅ Usa HTTPS (Render lo provee automáticamente)

## 📝 Checklist de Deployment

- [ ] MongoDB Atlas configurado
- [ ] Connection string obtenido
- [ ] Render Web Service creado
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Aplicación accesible
- [ ] Datos migrados
- [ ] Login funciona
- [ ] Productos cargan
- [ ] Cambiar contraseña de admin

## 🎯 URLs Importantes

- **MongoDB Atlas:** https://cloud.mongodb.com
- **Render Dashboard:** https://dashboard.render.com
- **Tu App:** https://tu-app.onrender.com
- **Documentación Render:** https://render.com/docs

## 💰 Costos

### Plan Free
- ✅ Gratis para siempre
- ✅ 750 horas/mes
- ❌ Se duerme después de 15 min de inactividad
- ❌ Arranque lento (~30s)

### Plan Starter ($7/mes)
- ✅ Siempre activo (24/7)
- ✅ Arranque rápido
- ✅ Más recursos

## 🔄 Comandos Útiles en Render Shell

```bash
# Ver variables de entorno
printenv

# Verificar base de datos
npm run verify

# Listar usuarios
node scripts/list-users.js

# Migrar datos
npm run migrate

# Ver logs de Node
pm2 logs
```

---

**¡Tu aplicación ahora está en producción!** 🎉

**Última actualización:** Noviembre 6, 2025
