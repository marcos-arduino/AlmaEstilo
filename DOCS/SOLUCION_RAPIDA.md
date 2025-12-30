# 🔧 Solución Rápida - Productos no Cargan

## 🔍 Problema Identificado

Tu base de datos tiene:
- ✅ 1 usuario admin
- ✅ 3 categorías
- ❌ 21 productos en **formato antiguo**

Los productos tienen `category` como **string** ("Remeras") pero las rutas nuevas esperan un **ObjectId**.

## ✅ Solución en 3 Pasos

### 1️⃣ Detener el Servidor Actual

Presiona `Ctrl + C` en la terminal donde está corriendo el servidor.

### 2️⃣ Ejecutar Script de Conversión

Ejecuta este comando para convertir los productos al nuevo formato:

```bash
node scripts/convert-products.js
```

### 3️⃣ Reiniciar el Servidor

```bash
npm run dev
```

## 🎯 ¿Qué hace el script?

1. Lee tus 21 productos actuales
2. Busca la categoría correspondiente por nombre
3. Reemplaza el string "Remeras" por el ObjectId de la categoría
4. Actualiza cada producto en la base de datos

## 📝 Después de la Conversión

Tus productos tendrán esta estructura:

```javascript
{
  "_id": "68ffb62cb05c741ab9be0fc0",
  "name": "Remera Roja",
  "price": 1500,
  "category": ObjectId("673abc..."),  // ← Ahora es ObjectId
  "image": "remeraroja.png",
  "stock": 20,
  "description": "Remera de algodón color rojo, talle M",
  "isActive": true,
  "slug": "remera-roja"
}
```

## ⚠️ Importante

- El script NO borra datos
- Hace backup automático antes de convertir
- Si algo sale mal, puedes restaurar desde el backup
