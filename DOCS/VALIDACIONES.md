# ✅ Reglas de Validación

## 👥 Registro de Usuarios

### Email
- ✅ **Formato válido** requerido (debe contener @ y dominio)
- ✅ **Único** - No puede haber dos usuarios con el mismo email
- ❌ Ejemplos inválidos: `asd`, `123`, `aa`, `test`
- ✅ Ejemplos válidos: `test@usuario.com`, `admin@example.com`

### Contraseña
- ✅ **Mínimo 6 caracteres**
- ❌ Ejemplos inválidos: `asd`, `123`, `aa` (muy cortos)
- ✅ Ejemplos válidos: `test123`, `password`, `admin123`

### Nombre
- ✅ **Requerido**
- ✅ Se genera automáticamente desde el email si no se proporciona

## 📦 Productos

### Nombre
- ✅ **Requerido**
- ✅ Genera slug automáticamente
- ✅ Si el slug ya existe, se agrega timestamp para hacerlo único

### Precio
- ✅ **Requerido**
- ✅ Debe ser un número
- ✅ Mínimo: 0

### Categoría
- ✅ **Requerida**
- ✅ Debe ser un ObjectId válido de una categoría existente

### Stock
- ✅ Opcional (default: 0)
- ✅ Mínimo: 0 (no puede ser negativo)

### Imagen
- ✅ **Requerida**
- ✅ Nombre del archivo (ej: `producto.png`)

### Slug
- ✅ **Único** - No puede haber dos productos con el mismo slug
- ✅ Se genera automáticamente del nombre
- ✅ Si hay duplicado, se agrega timestamp

## 📁 Categorías

### Nombre
- ✅ **Requerido**
- ✅ **Único**
- ✅ Genera slug automáticamente

### Slug
- ✅ **Único**
- ✅ Se genera automáticamente del nombre

## 🛒 Órdenes

### Items
- ✅ **Requerido**
- ✅ Debe tener al menos 1 item
- ✅ Cada item debe tener:
  - product (ObjectId)
  - quantity (número > 0)
  - price (número > 0)

### Dirección de Envío
- ✅ **Requerida**
- ✅ Debe incluir:
  - name
  - phone
  - street
  - city
  - state
  - zipCode

## 🔧 Errores Comunes y Soluciones

### "Email inválido"
**Causa:** El email no tiene formato válido  
**Solución:** Usa un email real como `test@usuario.com`

### "La contraseña debe tener al menos 6 caracteres"
**Causa:** Contraseña muy corta  
**Solución:** Usa mínimo 6 caracteres, ej: `test123`

### "El email ya está registrado"
**Causa:** Ya existe un usuario con ese email  
**Solución:** Usa otro email o haz login con el existente

### "E11000 duplicate key error - slug"
**Causa:** Ya existe un producto con ese slug  
**Solución:** Ahora se arregla automáticamente agregando timestamp

### "Categoría no encontrada"
**Causa:** El ID de categoría no existe  
**Solución:** Selecciona una categoría del dropdown

### "No autorizado - Token no proporcionado"
**Causa:** No estás logueado con la API (usaste login local)  
**Solución:** Cierra sesión y vuelve a entrar con `admin@almendra.com`

## 📝 Ejemplos de Datos Válidos

### Registro
```json
{
  "email": "nuevo@usuario.com",
  "password": "password123",
  "name": "Nuevo Usuario"
}
```

### Producto
```json
{
  "name": "Remera Nueva",
  "price": 2500,
  "category": "690d12ae44b2d45c940ded0b",
  "stock": 10,
  "image": "remera-nueva.png",
  "description": "Remera de algodón"
}
```

### Orden
```json
{
  "items": [
    {
      "product": "68ffb62cb05c741ab9be0fc0",
      "quantity": 2,
      "size": "M",
      "color": "Rojo"
    }
  ],
  "shippingAddress": {
    "name": "Juan Pérez",
    "phone": "+54 11 1234-5678",
    "street": "Av. Corrientes 1234",
    "city": "Buenos Aires",
    "state": "CABA",
    "zipCode": "1043"
  }
}
```

---

**Sigue estas reglas para evitar errores de validación!** ✅
