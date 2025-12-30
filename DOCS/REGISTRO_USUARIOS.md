# 👥 Sistema de Registro de Usuarios

## ✅ Cambios Realizados

El sistema de registro ahora **guarda usuarios en la base de datos MongoDB** en lugar de solo en localStorage.

## 🔄 Cómo Funciona

### Registro con API (Nuevo)
1. Usuario completa el formulario de registro
2. Se envía petición a `/api/auth/register`
3. Backend crea el usuario en MongoDB con:
   - Email
   - Contraseña hasheada (bcrypt)
   - Nombre (extraído del email)
   - Role: 'user' (por defecto)
4. Se genera un token JWT
5. Usuario queda logueado automáticamente

### Fallback a localStorage
Si la API falla (servidor caído, etc.), el sistema:
- Guarda el usuario en localStorage (como antes)
- Permite login local
- Mantiene compatibilidad

## 🧪 Probar el Registro

### 1. Ir a la página de registro
Click en "Registrarse" en la pantalla de login

### 2. Completar el formulario
```
Email o Usuario: nuevo@usuario.com
Contraseña: password123
```

### 3. Verificar que se guardó
```bash
node scripts/list-users.js
```

Deberías ver el nuevo usuario en la lista.

## 📊 Verificar Usuarios

### Listar todos los usuarios
```bash
node scripts/list-users.js
```

### Verificar base de datos
```bash
npm run verify
```

### Ver usuarios en MongoDB Compass
1. Conectar a `mongodb://localhost:27017`
2. Base de datos: `ecommerce`
3. Colección: `users`

## 🔑 Diferencias entre Usuarios

### Usuario de API (MongoDB)
- ✅ Guardado en base de datos
- ✅ Contraseña hasheada con bcrypt
- ✅ Token JWT real
- ✅ Puede crear órdenes persistentes
- ✅ Datos seguros

### Usuario Local (localStorage)
- ⚠️  Solo en el navegador
- ⚠️  Contraseña en texto plano
- ⚠️  Sin token JWT
- ⚠️  No puede usar funciones de admin
- ⚠️  Se pierde al limpiar caché

## 🎯 Recomendación

**Siempre usa emails para registrarte** (ej: `usuario@example.com`)

Esto asegura que:
- El usuario se guarde en MongoDB
- Tengas acceso a todas las funcionalidades
- Tus datos estén seguros

## 🔐 Seguridad

### Contraseñas
- ✅ Hasheadas con bcrypt (10 rounds)
- ✅ Nunca se almacenan en texto plano
- ✅ No se devuelven en las respuestas de la API

### Tokens JWT
- ✅ Expiran en 7 días
- ✅ Firmados con JWT_SECRET
- ✅ Incluyen solo el ID del usuario

### Validaciones
- ✅ Email único (no duplicados)
- ✅ Contraseña requerida
- ✅ Nombre requerido
- ✅ Email válido

## 📝 Ejemplo de Registro

```javascript
// Petición
POST /api/auth/register
{
  "email": "nuevo@usuario.com",
  "password": "password123",
  "name": "Nuevo Usuario"
}

// Respuesta
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673abc123def456789",
    "email": "nuevo@usuario.com",
    "name": "Nuevo Usuario",
    "role": "user"
  }
}
```

## 🛠️ Comandos Útiles

```bash
# Listar usuarios
node scripts/list-users.js

# Verificar base de datos
npm run verify

# Crear usuario admin adicional
node scripts/fix-admin-password.js

# Ver todos los datos
node check-db.js
```

## ⚠️ Notas Importantes

1. **Email único**: No puedes registrar el mismo email dos veces
2. **Formato de email**: Debe ser un email válido (con @)
3. **Contraseña**: Mínimo requerido por el modelo
4. **Login automático**: Después del registro, quedas logueado
5. **Role por defecto**: Todos los nuevos usuarios son 'user', no 'admin'

## 🔄 Migrar Usuarios Locales a MongoDB

Si tienes usuarios en localStorage que quieres migrar a MongoDB, necesitarías:

1. Exportarlos de localStorage
2. Crear un script de migración
3. Importarlos con contraseñas hasheadas

(Contacta si necesitas esto)

---

**¡Ahora los usuarios se guardan correctamente en MongoDB!** 🎉
