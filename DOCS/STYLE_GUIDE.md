# 🎨 Guía de Estilo - AlmaEstilo

## 📝 Convenciones de Código

### JavaScript/Node.js

**Estructura de archivos:**
```
src/
  controllers/    # Controladores de la API
  models/        # Modelos de MongoDB
  routes/        # Rutas de la API
  middleware/    # Middlewares personalizados
  services/      # Lógica de negocio
  utils/         # Utilidades y helpers
  config/        # Configuraciones
  validations/   # Esquemas de validación
```

**Convenciones de nomenclatura:**
- **Variables y funciones:** `camelCase`
- **Clases y constructores:** `PascalCase`
- **Constantes:** `UPPER_SNAKE_CASE`
- **Archivos:** `kebab-case.js`
- **Componentes React:** `PascalCase.jsx`

**Ejemplo de controlador:**
```javascript
// controllers/productController.js
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Obtener todos los productos
 * @route   GET /api/products
 * @access  Público
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, category, sort } = req.query;
  
  // Construir query
  const query = { isActive: true };
  if (category) query.categories = category;
  
  // Ejecutar query con paginación
  const products = await Product.find(query)
    .sort(sort || '-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('categories', 'name slug');
    
  const count = await Product.countDocuments(query);
  
  res.json({
    success: true,
    count: products.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: +page,
    data: products
  });
});
```

### React/Componentes

**Estructura de componentes:**
```
components/
  common/          # Componentes reutilizables
  layout/          # Componentes de diseño
  ui/              # Componentes de interfaz
  forms/           # Componentes de formulario
  products/        # Componentes específicos de productos
  cart/            # Componentes del carrito
  checkout/        # Componentes del proceso de pago
  account/         # Componentes de cuenta de usuario
  admin/           # Componentes del panel de administración
```

**Ejemplo de componente funcional con hooks:**
```jsx
// components/products/ProductCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price.base,
      image: product.images[0]?.url,
      quantity: 1
    });
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/producto/${product.slug}`} className="product-card__link">
        <div className="product-card__image-container">
          <img 
            src={product.images[0]?.url || '/images/placeholder.jpg'} 
            alt={product.name}
            className="product-card__image"
          />
          {product.price.sale && (
            <span className="product-card__sale-badge">
              -{Math.round((1 - product.price.sale / product.price.base) * 100)}%
            </span>
          )}
        </div>
        
        <div className="product-card__content">
          <h3 className="product-card__title">{product.name}</h3>
          <div className="product-card__price">
            {product.price.sale ? (
              <>
                <span className="product-card__price--sale">
                  {formatPrice(product.price.sale)}
                </span>
                <span className="product-card__price--original">
                  {formatPrice(product.price.base)}
                </span>
              </>
            ) : (
              <span>{formatPrice(product.price.base)}</span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="product-card__actions">
        <button 
          className={`btn ${isInCart(product._id) ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleAddToCart}
          disabled={isInCart(product._id)}
        >
          {isInCart(product._id) ? 'En el carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    price: PropTypes.shape({
      base: PropTypes.number.isRequired,
      sale: PropTypes.number,
      currency: PropTypes.string
    }).isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string
      })
    ).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      })
    )
  }).isRequired
};

export default ProductCard;
```

## 🎨 Diseño y Estilos

### Sistema de Diseño
- **Colores Primarios:** `#6C63FF` (Morado), `#4A45B1` (Morado oscuro)
- **Colores Secundarios:** `#00BFA6` (Verde agua), `#FF6584` (Rosado)
- **Tipografía:** 'Inter', -apple-system, sans-serif
- **Espaciado:** Múltiplos de 4px (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 768)
- **Sombras:** 
  - Pequeña: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`
  - Media: `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`
  - Grande: `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`

### Convenciones CSS
- **Metodología:** BEM (Block Element Modifier)
- **Preprocesador:** SCSS
- **Estructura de carpetas:**
  ```
  styles/
    base/           # Estilos base, variables, mixins
    components/     # Estilos de componentes
    layout/         # Estilos de diseño (header, footer, grid)
    pages/          # Estilos específicos de páginas
    themes/         # Temas (claro/oscuro)
    utils/          # Utilidades y helpers
  ```

**Ejemplo de componente con BEM:**
```scss
// components/_product-card.scss
.product-card {
  $self: &;
  position: relative;
  background: $color-white;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    
    #{$self}__image {
      transform: scale(1.05);
    }
  }

  &__link {
    text-decoration: none;
    color: inherit;
    display: block;
    flex-grow: 1;
  }

  &__image-container {
    position: relative;
    padding-top: 100%; // Cuadrado 1:1
    overflow: hidden;
    background: $color-gray-100;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &__sale-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: $color-error;
    color: $color-white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: $border-radius-pill;
    z-index: 1;
  }

  &__content {
    padding: 1rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.5rem;
    @include line-clamp(2);
  }

  &__price {
    font-weight: 600;
    color: $color-gray-900;
    
    &--sale {
      color: $color-error;
      margin-right: 0.5rem;
    }
    
    &--original {
      text-decoration: line-through;
      color: $color-gray-500;
      font-size: 0.875rem;
    }
  }

  &__actions {
    padding: 0 1rem 1rem;
    margin-top: auto;
  }
}
```

## 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Tipos de commit:**
- `feat`: Nueva característica
- `fix`: Corrección de errores
- `docs`: Cambios en la documentación
- `style`: Cambios de formato (puntos, comas, etc.)
- `refactor`: Cambios en el código que no corrigen errores ni agregan características
- `perf`: Mejoras de rendimiento
- `test`: Agregar o corregir pruebas
- `chore`: Cambios en el proceso de construcción o herramientas auxiliares

**Ejemplos:**
```
feat(products): agregar filtrado por categoría

Se agregó la funcionalidad para filtrar productos por categoría en la página de listado.
Se actualizaron los estilos para los filtros móviles.

Closes #123
```

```
fix(auth): corregir validación de contraseña

Se corrigió un problema donde la validación de contraseña no verificaba correctamente la longitud mínima.

Fixes #456
```

## 🔍 Revisión de Código

### Directrices para Pull Requests
1. **Título descriptivo** que resuma los cambios
2. **Descripción detallada** que incluya:
   - Propósito del cambio
   - Cambios realizados
   - Capturas de pantalla (si aplica)
   - Issues relacionados
3. **Cobertura de pruebas** para los cambios realizados
4. **Documentación actualizada** si es necesario
5. **Aprobación** de al menos un revisor

### Checklist de Revisión
- [ ] El código sigue las convenciones establecidas
- [ ] Se han agregado pruebas unitarias
- [ ] Se ha probado en diferentes navegadores
- [ ] La documentación ha sido actualizada
- [ ] No hay código comentado o de depuración
- [ ] No hay credenciales expuestas
- [ ] El rendimiento no se ha visto afectado negativamente

## 📦 Estructura de Carpetas

```
almaestilo/
├── client/                  # Aplicación React
│   ├── public/              # Archivos estáticos
│   └── src/
│       ├── assets/          # Imágenes, fuentes, etc.
│       ├── components/      # Componentes reutilizables
│       ├── config/          # Configuración de la app
│       ├── contexts/        # Contextos de React
│       ├── hooks/           # Custom hooks
│       ├── layouts/         # Componentes de diseño
│       ├── pages/           # Componentes de páginas
│       ├── services/        # Llamadas a la API
│       ├── styles/          # Estilos globales
│       ├── utils/           # Utilidades
│       ├── App.jsx          # Componente raíz
│       └── index.jsx        # Punto de entrada
│
├── src/                     # Backend Node.js/Express
│   ├── config/              # Configuraciones
│   ├── controllers/         # Controladores
│   ├── middleware/          # Middlewares
│   ├── models/             # Modelos de MongoDB
│   ├── routes/             # Rutas de la API
│   ├── services/           # Lógica de negocio
│   ├── utils/              # Utilidades
│   └── app.js              # Aplicación Express
│
├── .github/                # Configuración de GitHub
├── docs/                   # Documentación
└── scripts/                # Scripts de utilidad
```

## 🛠️ Herramientas Recomendadas

### Desarrollo
- **Editor de código:** VS Code con extensiones recomendadas
- **Cliente API:** Postman o Insomnia
- **Base de datos:** MongoDB Compass
- **Control de versiones:** Git con Git Flow

### Calidad de Código
- **Linting:** ESLint con configuración Airbnb
- **Formateo:** Prettier
- **Análisis estático:** SonarQube
- **Testing:** Jest y React Testing Library

### Despliegue
- **Entornos:** Desarrollo, Staging, Producción
- **CI/CD:** GitHub Actions
- **Monitoreo:** Sentry para frontend y backend
- **Logs:** Papertrail o LogDNA

## 🔄 Flujo de Trabajo

1. **Crear una rama** a partir de `develop`
   ```
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-de-la-caracteristica
   ```

2. **Hacer commits** siguiendo las convenciones
   ```
   git add .
   git commit -m "feat(products): agregar búsqueda por nombre"
   ```

3. **Subir los cambios**
   ```
   git push -u origin feature/nombre-de-la-caracteristica
   ```

4. **Crear un Pull Request** a `develop`
   - Asignar revisores
   - Esperar aprobación
   - Resolver conflictos si es necesario

5. **Mergear** después de la aprobación
   ```
   git checkout develop
   git merge --no-ff feature/nombre-de-la-caracteristica
   git push origin develop
   ```

6. **Eliminar la rama** (opcional)
   ```
   git branch -d feature/nombre-de-la-caracteristica
   git push origin --delete feature/nombre-de-la-caracteristica
   ```

## 📅 Versionado

Seguimos [Semantic Versioning](https://semver.org/) para el versionado del proyecto:

- **Versión Mayor (1.0.0):** Cambios que rompen la compatibilidad
- **Versión Menor (0.1.0):** Nuevas características compatibles
- **Parche (0.0.1):** Correcciones de errores compatibles

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
