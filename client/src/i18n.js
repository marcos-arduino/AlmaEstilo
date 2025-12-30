import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones
const resources = {
  es: {
    translation: {
      // Header
      "welcome": "Bienvenido a",
      "logout": "Cerrar sesión",
      "cart": "Carrito",
      
      // Login/Register
      "login": "Iniciar sesión",
      "register": "Registrarse",
      "email": "Email o Usuario",
      "password": "Contraseña",
      "alreadyHaveAccount": "¿Ya tenés cuenta?",
      "startSession": "Iniciar sesión",
      "dontHaveAccount": "¿No tenés cuenta?",
      "registerHere": "Registrate acá",
      
      // Products
      "catalog": "Catálogo",
      "allCategories": "Todas las categorías",
      "addToCart": "Agregar al carrito",
      "stock": "Stock",
      
      // Cart
      "myCart": "Mi Carrito",
      "emptyCart": "El carrito está vacío",
      "quantity": "Cantidad",
      "price": "Precio",
      "subtotal": "Subtotal",
      "total": "Total",
      "checkout": "Finalizar Compra",
      
      // Admin
      "addNewProduct": "Agregar nuevo producto",
      "name": "Nombre",
      "category": "Categoría",
      "selectCategory": "Seleccionar categoría",
      "imageName": "Nombre archivo imagen",
      "upload": "Subir",
      
      // Messages
      "completeAllFields": "Complete todos los campos",
      "userAlreadyExists": "El usuario ya existe",
      "registeredSuccessfully": "Usuario registrado con éxito!",
      "incorrectCredentials": "Usuario o contraseña incorrectos",
      "productAddedSuccessfully": "Producto agregado exitosamente",
      "errorAddingProduct": "Error al subir producto",
      "mustUseValidEmail": "Debe usar un email válido (ejemplo: usuario@dominio.com)",
      "passwordMinLength": "La contraseña debe tener al menos 6 caracteres",
      
      // Common
      "loading": "Cargando...",
      "error": "Error",
      "success": "Éxito",
      "cancel": "Cancelar",
      "confirm": "Confirmar",
      "save": "Guardar",
      "delete": "Eliminar",
      "edit": "Editar"
    }
  },
  en: {
    translation: {
      // Header
      "welcome": "Welcome to",
      "logout": "Logout",
      "cart": "Cart",
      
      // Login/Register
      "login": "Login",
      "register": "Register",
      "email": "Email or Username",
      "password": "Password",
      "alreadyHaveAccount": "Already have an account?",
      "startSession": "Sign in",
      "dontHaveAccount": "Don't have an account?",
      "registerHere": "Register here",
      
      // Products
      "catalog": "Catalog",
      "allCategories": "All categories",
      "addToCart": "Add to cart",
      "stock": "Stock",
      
      // Cart
      "myCart": "My Cart",
      "emptyCart": "Cart is empty",
      "quantity": "Quantity",
      "price": "Price",
      "subtotal": "Subtotal",
      "total": "Total",
      "checkout": "Checkout",
      
      // Admin
      "addNewProduct": "Add new product",
      "name": "Name",
      "category": "Category",
      "selectCategory": "Select category",
      "imageName": "Image file name",
      "upload": "Upload",
      
      // Messages
      "completeAllFields": "Please complete all fields",
      "userAlreadyExists": "User already exists",
      "registeredSuccessfully": "User registered successfully!",
      "incorrectCredentials": "Incorrect username or password",
      "productAddedSuccessfully": "Product added successfully",
      "errorAddingProduct": "Error uploading product",
      "mustUseValidEmail": "Must use a valid email (example: user@domain.com)",
      "passwordMinLength": "Password must be at least 6 characters",
      
      // Common
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "cancel": "Cancel",
      "confirm": "Confirm",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'es', // Idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
