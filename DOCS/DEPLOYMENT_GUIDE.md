# 🚀 Guía de Despliegue - AlmaEstilo

Esta guía proporciona instrucciones para desplegar la aplicación AlmaEstilo en diferentes entornos.

## 📋 Requisitos Previos

- Node.js 16+ y npm 8+
- MongoDB 6.0+
- Git
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (para producción)
- Cuenta en [Render](https://render.com/) o servicio similar
- Cuenta en [Cloudinary](https://cloudinary.com/) para almacenamiento de imágenes
- Claves de API de Mercado Pago

## 🛠 Configuración del Entorno

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/almaestilo.git
   cd almaestilo
   ```

2. **Instalar dependencias**
   ```bash
   # Instalar dependencias del backend
   npm install
   
   # Instalar dependencias del frontend
   cd client
   npm install
   cd ..
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   ```

   Editar el archivo `.env` con tus credenciales:
   ```env
   # General
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   
   # Base de datos
   MONGODB_URI=mongodb://localhost:27017/almaestilo
   
   # Autenticación
   JWT_SECRET=tu_super_secreto_jwt
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   
   # Mercado Pago
   MP_ACCESS_TOKEN=tu_token_mercadopago
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   
   # Correo electrónico (Mailtrap para desarrollo)
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=tu_usuario_mailtrap
   SMTP_PASS=tu_contraseña_mailtrap
   EMAIL_FROM=noreply@almaestilo.com
   ```

## 🖥 Desarrollo Local

1. **Iniciar el servidor de desarrollo**
   ```bash
   # Iniciar backend y frontend juntos (concurrently)
   npm run dev
   
   # O por separado:
   # En una terminal (backend)
   npm run server
   
   # En otra terminal (frontend)
   cd client
   npm start
   ```

2. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Documentación de la API: http://localhost:5000/api-docs

## 🚀 Despliegue en Producción

### 1. Configuración de la Base de Datos

1. **MongoDB Atlas**
   - Crear un clúster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Configurar una base de datos y un usuario
   - Obtener la cadena de conexión
   - Agregar tu IP a la lista blanca

2. **Actualizar variables de entorno**
   ```env
   NODE_ENV=production
   MONGODB_URI=tu_cadena_de_conexion_atlas
   ```

### 2. Desplegar el Backend

**Opción A: Usando Render (recomendado)**

1. Crear una nueva cuenta en [Render](https://render.com/)
2. Hacer clic en "New" > "Web Service"
3. Conectar tu repositorio de GitHub
4. Configurar el servicio:
   - **Name:** almaestilo-api
   - **Region:** Elige la más cercana a tu audiencia
   - **Branch:** main
   - **Build Command:** npm install && npm run build
   - **Start Command:** npm start
   - **Environment Variables:** Agregar todas las variables del archivo `.env`

**Opción B: Usando Heroku**

```bash
# Instalar CLI de Heroku
npm install -g heroku

# Iniciar sesión
heroku login

# Crear aplicación
heroku create almaestilo-api

# Agregar addon de MongoDB
heroku addons:create mongolab:sandbox

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_super_secreto_jwt
# ... agregar otras variables

# Desplegar
git push heroku main
```

### 3. Desplegar el Frontend

**Opción A: Usando Vercel (recomendado)**

1. Crear una cuenta en [Vercel](https://vercel.com/)
2. Importar el proyecto desde GitHub
3. Configurar el proyecto:
   - **Framework Preset:** Create React App
   - **Build Command:** npm run build
   - **Output Directory:** build
   - **Install Command:** npm install
4. Configurar variables de entorno:
   ```
   REACT_APP_API_URL=https://tu-api-url.com
   NODE_ENV=production
   ```
5. Hacer clic en "Deploy"

**Opción B: Usando Netlify**

1. Crear una cuenta en [Netlify](https://www.netlify.com/)
2. Arrastrar y soltar la carpeta `build` o conectar tu repositorio
3. Configurar la ruta de build:
   - **Build command:** npm run build
   - **Publish directory:** build/
4. Configurar variables de entorno en "Site settings" > "Build & deploy" > "Environment"

### 4. Configurar Dominio Personalizado (Opcional)

1. Comprar un dominio en [Namecheap](https://www.namecheap.com/), [GoDaddy](https://www.godaddy.com/) o similar
2. Configurar los registros DNS:
   - Para el frontend (www): CNAME apuntando a tu despliegue de Vercel/Netlify
   - Para la API (api): A o CNAME apuntando a tu backend
3. Configurar SSL/HTTPS (generalmente automático en Vercel/Netlify)

## 🔄 Variables de Entorno de Producción

Asegúrate de configurar estas variables en producción:

```env
# General
NODE_ENV=production
PORT=5000
CLIENT_URL=https://tudominio.com

# Base de datos
MONGODB_URI=tu_cadena_de_conexion_atlas

# Autenticación
JWT_SECRET=generar_un_secreto_seguro
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

# Mercado Pago
MP_ACCESS_TOKEN=tu_token_mercadopago_produccion

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Correo electrónico (usar servicio real como SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu_api_key_sendgrid
EMAIL_FROM=hola@tudominio.com

# Otras configuraciones
RATE_LIMIT_WINDOW_MS=15 * 60 * 1000  # 15 minutos
RATE_LIMIT_MAX=100  # 100 solicitudes por ventana
```

## 🔒 Seguridad en Producción

1. **Protección contra ataques comunes**
   - Usar `helmet` para cabeceras de seguridad
   - Implementar rate limiting
   - Validar y sanear todas las entradas
   - Usar consultas parametrizadas

2. **Configuración del servidor**
   - Mantener Node.js y las dependencias actualizadas
   - Usar PM2 o similar para gestión de procesos
   - Configurar logs y monitoreo
   - Hacer copias de seguridad regulares de la base de datos

3. **HTTPS**
   - Asegurarse de que todo el tráfico use HTTPS
   - Configurar HSTS
   - Usar certificados SSL válidos (Let's Encrypt)

## 📊 Monitoreo y Mantenimiento

1. **Monitoreo de rendimiento**
   - Usar [PM2](https://pm2.io/) para monitoreo de Node.js
   - Configurar alertas de errores (Sentry, LogRocket)
   - Monitorear el uso de recursos (CPU, memoria, disco)

2. **Logs**
   - Configurar registro centralizado (Papertrail, LogDNA)
   - Implementar niveles de log apropiados
   - Rotación de logs para evitar llenar el disco

3. **Copia de seguridad**
   - Configurar copias de seguridad automáticas de MongoDB Atlas
   - Probar regularmente la restauración de copias de seguridad
   - Almacenar copias de seguridad en una ubicación segura

## 🔄 Actualizaciones

1. **Proceso de actualización**
   ```bash
   # Obtener los últimos cambios
   git pull origin main
   
   # Instalar nuevas dependencias
   npm install
   
   # Reconstruir el frontend
   cd client
   npm install
   npm run build
   cd ..
   
   # Reiniciar la aplicación
   pm2 restart all
   ```

2. **Migraciones de base de datos**
   - Usar migraciones para cambios en el esquema
   - Probar migraciones en un entorno de staging primero
   - Hacer copia de seguridad antes de migraciones importantes

## 🚨 Solución de Problemas Comunes

### La aplicación no se inicia
- Verificar logs de error: `pm2 logs`
- Comprobar que MongoDB esté en ejecución
- Verificar que todas las variables de entorno estén configuradas

### Errores de conexión a la base de datos
- Verificar la cadena de conexión de MongoDB
- Asegurarse de que la IP esté en la lista blanca de MongoDB Atlas
- Comprobar que el usuario tenga los permisos correctos

### Problemas de CORS
- Verificar que `CLIENT_URL` esté configurado correctamente
- Asegurarse de que el frontend esté accediendo al backend correcto

### Rendimiento lento
- Revisar consultas a la base de datos con `explain()`
- Implementar caché con Redis si es necesario
- Optimizar imágenes y activos estáticos

## 📞 Soporte

Para problemas técnicos, por favor:
1. Revisar los logs de la aplicación
2. Verificar el estado de los servicios en uso
3. Abrir un issue en el repositorio de GitHub

Para soporte urgente, contactar al equipo de desarrollo en soporte@almaestilo.com
