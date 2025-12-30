# ✅ Checklist de Instalación Rápida

## 📋 Antes de Empezar

- [ ] Node.js instalado (`node --version`)
- [ ] MongoDB instalado (`mongod --version`)
- [ ] Git instalado (`git --version`)

## 🚀 Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/vadalabau/ecommerceAlmendra.git
cd ecommerceAlmendra

# 2. Instalar dependencias backend
npm install

# 3. Instalar dependencias frontend
cd client
npm install
cd ..

# 4. Crear archivo .env
cp .env.example .env
# Editar .env con tus valores

# 5. Crear archivo client/.env.local
cd client
cp .env.example .env.local
# Editar con: REACT_APP_API_URL=http://localhost:5000
cd ..

# 6. Iniciar MongoDB
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod

# 7. Migrar datos
npm run migrate

# 8. Verificar instalación
npm run verify
```

## 🎯 Iniciar Proyecto

### Terminal 1: Backend
```bash
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm start
```

## 🔑 Login Inicial

```
Email: admin@almendra.com
Password: admin123
```

## ✅ Verificación

- [ ] Backend corriendo en http://localhost:5000
- [ ] Frontend corriendo en http://localhost:3000
- [ ] Puedes ver productos
- [ ] Puedes hacer login
- [ ] MongoDB tiene datos (`npm run verify`)

## 📝 Variables de Entorno Mínimas

### .env (raíz)
```env
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_clave_secreta
PORT=5000
```

### client/.env.local
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🆘 Problemas Comunes

| Error | Solución |
|-------|----------|
| Cannot connect to MongoDB | `net start MongoDB` (Windows) |
| Port 5000 in use | Cambiar `PORT` en `.env` |
| Module not found | `npm install` |
| Pantalla blanca | Verificar `client/.env.local` |
| No hay productos | `npm run migrate` |

---

**¿Todo funcionando? ¡Perfecto! 🎉**
