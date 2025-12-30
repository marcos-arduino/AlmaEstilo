# 🌍 Sistema de Traducción (i18n)

## 📋 Descripción

El proyecto ahora soporta **múltiples idiomas** (Español e Inglés) usando `react-i18next`.

## 🎯 Idiomas Disponibles

- **Español (ES)** - Idioma por defecto
- **English (EN)**

## 🔧 Implementación

### Librerías Utilizadas

```json
{
  "i18next": "^25.6.1",
  "react-i18next": "^15.2.0"
}
```

### Archivos Creados

1. **`client/src/i18n.js`** - Configuración de i18next y traducciones
2. **`client/src/language-selector.css`** - Estilos para los botones de idioma

### Estructura de Traducciones

Las traducciones están organizadas en el archivo `i18n.js`:

```javascript
const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido a",
      "logout": "Cerrar sesión",
      // ... más traducciones
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to",
      "logout": "Logout",
      // ... más traducciones
    }
  }
};
```

## 🎨 Interfaz de Usuario

### Selector de Idioma

El selector de idioma aparece en dos lugares:

#### 1. Pantalla de Login/Registro
- Botones **ES** / **EN** en la parte superior
- Cambia el idioma de toda la interfaz

#### 2. Header (Cuando estás logueado)
- Botones **ES** / **EN** en la navegación
- Persiste la selección en `localStorage`

### Textos Traducidos

Todos los textos de la interfaz están traducidos:

#### Login/Registro
- ✅ "Iniciar sesión" / "Login"
- ✅ "Registrarse" / "Register"
- ✅ "Email o Usuario" / "Email or Username"
- ✅ "Contraseña" / "Password"
- ✅ Mensajes de error

#### Catálogo
- ✅ "Catálogo" / "Catalog"
- ✅ "Carrito" / "Cart"
- ✅ "Agregar al carrito" / "Add to cart"
- ✅ "Stock" / "Stock"

#### Carrito
- ✅ "Mi Carrito" / "My Cart"
- ✅ "El carrito está vacío" / "Cart is empty"
- ✅ "Total" / "Total"
- ✅ "Finalizar Compra" / "Checkout"

#### Admin
- ✅ "Agregar nuevo producto" / "Add new product"
- ✅ "Nombre" / "Name"
- ✅ "Precio" / "Price"
- ✅ "Categoría" / "Category"
- ✅ "Subir" / "Upload"

#### Mensajes
- ✅ "Complete todos los campos" / "Please complete all fields"
- ✅ "Usuario registrado con éxito!" / "User registered successfully!"
- ✅ "Producto agregado exitosamente" / "Product added successfully"
- ✅ Y más...

## 💻 Uso en el Código

### Hook de Traducción

```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

### Cambiar Idioma

```javascript
const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
};
```

### Usar Traducciones

```javascript
// Simple
<h2>{t('login')}</h2>

// Con placeholders
<input placeholder={t('email')} />

// En alerts
alert(t('registeredSuccessfully'));

// Concatenación
alert(t('error') + ': ' + t('category'));
```

## 🔄 Persistencia

El idioma seleccionado se guarda en `localStorage`:

```javascript
// Al cambiar idioma
localStorage.setItem('language', 'en');

// Al iniciar la app
lng: localStorage.getItem('language') || 'es'
```

## 🎨 Estilos

### Botones de Idioma

```css
.language-selector button {
  padding: 0.5rem 1rem;
  border: 2px solid #e8a87c;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-selector button.active {
  background: #e8a87c;
  color: white;
}
```

## 📝 Agregar Nuevas Traducciones

### 1. Editar `client/src/i18n.js`

```javascript
const resources = {
  es: {
    translation: {
      // ... traducciones existentes
      "newKey": "Nuevo Texto"
    }
  },
  en: {
    translation: {
      // ... traducciones existentes
      "newKey": "New Text"
    }
  }
};
```

### 2. Usar en el Componente

```javascript
<p>{t('newKey')}</p>
```

## 🌐 Agregar Más Idiomas

### 1. Agregar Traducciones

```javascript
const resources = {
  es: { /* ... */ },
  en: { /* ... */ },
  pt: {
    translation: {
      "welcome": "Bem-vindo a",
      "logout": "Sair",
      // ... más traducciones
    }
  }
};
```

### 2. Agregar Botón

```javascript
<button onClick={() => changeLanguage('pt')}>
  PT
</button>
```

## 🧪 Testing

### Verificar Traducciones

1. Abre la aplicación
2. Haz click en **EN** en el login
3. Verifica que todos los textos cambien a inglés
4. Haz click en **ES**
5. Verifica que vuelvan a español
6. Recarga la página
7. Verifica que se mantenga el idioma seleccionado

### Checklist de Traducción

- [ ] Login/Registro traduce correctamente
- [ ] Header traduce correctamente
- [ ] Catálogo traduce correctamente
- [ ] Carrito traduce correctamente
- [ ] Panel de admin traduce correctamente
- [ ] Mensajes de error traducen correctamente
- [ ] Idioma persiste después de recargar
- [ ] Botones de idioma muestran el activo

## 📊 Estadísticas

- **Textos traducidos:** ~30 keys
- **Idiomas soportados:** 2 (ES, EN)
- **Componentes afectados:** 1 (App.js)
- **Archivos de configuración:** 1 (i18n.js)
- **Archivos de estilos:** 1 (language-selector.css)

## 🔧 Configuración

### Idioma por Defecto

```javascript
i18n.init({
  lng: localStorage.getItem('language') || 'es', // Español por defecto
  fallbackLng: 'es'
});
```

### Cambiar Idioma por Defecto

Para cambiar el idioma por defecto a inglés:

```javascript
lng: localStorage.getItem('language') || 'en', // Inglés por defecto
fallbackLng: 'en'
```

## 🎯 Beneficios

1. **Accesibilidad** - Usuarios de diferentes países pueden usar la app
2. **Profesionalismo** - Demuestra atención al detalle
3. **Escalabilidad** - Fácil agregar más idiomas
4. **UX Mejorada** - Usuarios se sienten más cómodos en su idioma
5. **SEO** - Mejor posicionamiento en diferentes regiones

## 📚 Recursos

- [react-i18next Documentación](https://react.i18next.com/)
- [i18next Documentación](https://www.i18next.com/)
- [Guía de Internacionalización](https://www.i18next.com/overview/getting-started)

---

**¡Tu aplicación ahora es multiidioma!** 🌍

**Última actualización:** Noviembre 6, 2025
