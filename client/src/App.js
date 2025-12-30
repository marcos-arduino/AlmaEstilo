import React, { useState, useEffect } from 'react';
import './App.css';
import './mobile-fix.css';
import './language-selector.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './i18n';

// Configurar baseURL de axios con normalización para evitar URLs inválidas como ":5000"
(function configureAxiosBaseURL() {
  const envUrl = process.env.REACT_APP_API_URL;
  const fallback = (typeof window !== 'undefined' && window.location)
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://localhost:5000';

  const normalize = (url) => {
    if (!url) return fallback;
    // Si ya incluye protocolo, usar tal cual
    if (/^https?:\/\//i.test(url)) return url;
    // Si empieza con ":" o solo un puerto, construir con host actual
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    const port = url.replace(/^:+/, '');
    return `${protocol}//${host}:${port}`;
  };

  axios.defaults.baseURL = normalize(envUrl);
})();

function App() {
  const { t, i18n } = useTranslation();
  
  const [user, setUser] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState('catalog'); // 'catalog' | 'cart'

  // Usuarios guardados en localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    if (saved) return JSON.parse(saved);
    return [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'cliente', password: 'user123', role: 'user' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('/api/productos')
      .then(res => {
        setProducts(res.data);
        console.log('Productos cargados:', res.data);
      })
      .catch(err => console.error('Error al cargar productos:', err?.message || err));
  }, []);

  // Extraer categorías (ahora pueden ser objetos o strings)
  const categories = [...new Set(products.map(p => {
    if (typeof p.category === 'object' && p.category?.name) {
      return p.category.name;
    }
    return p.category;
  }).filter(Boolean))];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Intentar login con API del backend
      const response = await axios.post('/api/auth/login', {
        email: user.username, // El campo username ahora acepta email
        password: user.password
      });
      
      if (response.data && response.data.token) {
        // Guardar token y usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        
        setIsLoggedIn(true);
        setUserRole(response.data.user.role);
        setError('');
      }
    } catch (error) {
      console.error('Error de login:', error);
      
      // Fallback: intentar con usuarios locales (compatibilidad)
      const found = users.find(u => u.username === user.username && u.password === user.password);
      if (found) {
        setIsLoggedIn(true);
        setUserRole(found.role);
        setError('');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (!user.username || !user.password) {
      setError(t('completeAllFields'));
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.username)) {
      setError(t('mustUseValidEmail'));
      return;
    }
    
    // Validar longitud de contraseña
    if (user.password.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }
    
    setError('');
    
    try {
      // Intentar registrar con API del backend
      const response = await axios.post('/api/auth/register', {
        email: user.username, // El campo username ahora acepta email
        password: user.password,
        name: user.username.split('@')[0] || 'Usuario' // Usar la parte antes del @ como nombre
      });
      
      if (response.data && response.data.token) {
        // Registro exitoso - hacer login automático
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        
        alert(t('registeredSuccessfully'));
        setIsLoggedIn(true);
        setUserRole(response.data.user.role);
        setIsRegistering(false);
        setUser({ username: '', password: '' });
      }
    } catch (error) {
      console.error('Error de registro:', error);
      
      // Si hay respuesta de la API, mostrar el error y NO hacer fallback
      if (error.response) {
        const errorMsg = error.response.data?.error || 'Error al registrar usuario';
        setError(errorMsg);
        return;
      }
      
      // Solo hacer fallback si el servidor no responde (está caído)
      if (error.message === 'Network Error' || !error.response) {
        console.log('API no disponible, usando localStorage como fallback');
        
        if (users.some(u => u.username === user.username)) {
          setError('El usuario ya existe');
          return;
        }
        
        const newUser = { username: user.username, password: user.password, role: 'user' };
        setUsers([...users, newUser]);
        setError('');
        alert('Usuario registrado localmente. Para guardarlo en la base de datos, el servidor debe estar activo.');
        setIsRegistering(false);
        setUser({ username: '', password: '' });
      } else {
        setError('Error al registrar usuario');
      }
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existing = cart.find(item => item._id === productId);
    if (!existing) return;
    if (existing.qty === 1) {
      setCart(cart.filter(item => item._id !== productId));
    } else {
      setCart(cart.map(item => item._id === productId ? { ...item, qty: item.qty - 1 } : item));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Iniciar pago con Mercado Pago (Checkout Pro por redirección)
  const handleCheckout = async () => {
    try {
      if (!cart.length) return;
      const items = cart.map(i => ({
        _id: i._id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: getImageSrc(i.image)
      }));
      const { data } = await axios.post('/api/payments/create-preference', { items });
      const target = data.init_point
        || data.sandbox_init_point
        || data.redirect_url
        || (data.preferenceId ? `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${data.preferenceId}` : null);
      if (target) {
        window.location.href = target;
      } else {
        alert('No se pudo iniciar el pago');
      }
    } catch (e) {
      console.error('Checkout error', e?.message || e);
      alert('No se pudo iniciar el pago');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUser({ username: '', password: '' });
    setCart([]);
    setError('');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
      alert(t('completeAllFields'));
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Buscar el ID de la categoría por nombre
      const categoriesResponse = await axios.get('/api/categories');
      const categoryObj = categoriesResponse.data.find(c => c.name === newProduct.category);
      
      if (!categoryObj) {
        alert(t('error') + ': ' + t('category'));
        return;
      }
      
      const productData = {
        ...newProduct,
        category: categoryObj._id, // Usar el ID de la categoría
        stock: 10 // Stock por defecto
      };
      
      const response = await axios.post('/api/products', productData, { headers });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', category: '', image: '' });
      alert(t('productAddedSuccessfully'));
    } catch (err) {
      console.error('Error al subir producto:', err);
      alert(t('errorAddingProduct') + ': ' + (err.response?.data?.error || err.message));
    }
  };

  // Para mostrar bien la imagen, concatenamos con la URL base del backend
  const getImageSrc = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    const base = (axios.defaults.baseURL || '').replace(/\/+$/,'');
    if (image.startsWith('/img/')) return `${base}${image}`;
    if (image.startsWith('img/')) return `${base}/${image}`;
    return `${base}/img/${image.replace(/^\/+/, '')}`;
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="login-box">
          <div className="language-selector">
            <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
            <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
          </div>
          <h2>{isRegistering ? t('register') : t('login')}</h2>
          <form onSubmit={isRegistering ? handleRegisterUser : handleLogin}>
            <input
              type="text"
              placeholder={t('email')}
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder={t('password')}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button className="btn" type="submit">{isRegistering ? t('register') : t('startSession')}</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p className="hint">
            {isRegistering ? t('alreadyHaveAccount') + ' ' : t('dontHaveAccount') + ' '}
            <button className="link-button" onClick={() => {
              setError('');
              setIsRegistering(!isRegistering);
              setUser({ username: '', password: '' });
            }}>{isRegistering ? t('startSession') : t('registerHere')}</button>
          </p>
        </div>
      ) : (
        <>
          <header className="site-header">
            <div className="container">
              <div className="brand">
                <span className="brand-mark">A</span>
                <span className="brand-name">Alma Estilo</span>
              </div>
              <nav className="nav">
                <button className={`nav-link ${page==='catalog' ? 'active' : ''}`} onClick={() => setPage('catalog')}>{t('catalog')}</button>
                <button className={`nav-link ${page==='cart' ? 'active' : ''}`} onClick={() => setPage('cart')}>{t('cart')} ({cart.reduce((sum,item)=>sum+item.qty,0)})</button>
                <div className="language-selector-header">
                  <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
                  <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
                </div>
                <button className="nav-link" onClick={handleLogout}>{t('logout')}</button>
              </nav>
            </div>
          </header>

          {page === 'cart' && (
            <section className="cart-panel">
              <h2>{t('myCart')} ({userRole})</h2>
              <div className="cart">
                {cart.length === 0 ? (
                  <p>{t('emptyCart')}</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div className="cart-item" key={item._id}>
                        <img src={getImageSrc(item.image)} alt={item.name} className="cart-image" loading='lazy' />
                        <div className="cart-info">
                          <strong>{item.name}</strong> – ${item.price.toLocaleString()} x {item.qty}
                        </div>
                        <div className="cart-controls">
                          <button className="btn btn-small" onClick={() => removeFromCart(item._id)}>-</button>
                          <button className="btn btn-small" onClick={() => addToCart(item)}>+</button>
                        </div>
                      </div>
                    ))}
                    <div className="total">{t('total')}: ${total.toLocaleString()}</div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                      <button className="btn btn-primary" onClick={handleCheckout}>
                        {t('checkout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {page === 'catalog' && userRole === 'admin' && (
            <section className="admin-panel">
              <h2>{t('addNewProduct')}</h2>
              <form onSubmit={handleProductSubmit}>
                <input
                  placeholder={t('name')}
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                  placeholder={t('price')}
                  type="number"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  required
                >
                  <option value="">{t('selectCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  placeholder={t('imageName')}
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                <button className="btn" type="submit">{t('upload')}</button>
              </form>
            </section>
          )}

          {page === 'catalog' && (
            <>
              
              <main className="catalog" id="catalogo">
                {categories.length === 0 && (
                  <p className="empty">No hay productos disponibles.</p>
                )}
                {categories.sort().map(category => (
                  <div key={category}>
                    <h2 className="category-title">{category}</h2>
                    <div className="product-list">
                      {products.filter(p => {
                        const prodCategory = typeof p.category === 'object' && p.category?.name 
                          ? p.category.name 
                          : p.category;
                        return prodCategory === category;
                      }).map(product => (
                        <div className="product-card" key={product._id}>
                          <div className="product-media">
                            <img src={getImageSrc(product.image)} alt={product.name} className="product-image" loading='lazy' />
                          </div>
                          <div className="product-content">
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-price">${product.price.toLocaleString()}</p>
                            <button className="btn" onClick={() => addToCart(product)}>Agregar al carrito</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </main>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
