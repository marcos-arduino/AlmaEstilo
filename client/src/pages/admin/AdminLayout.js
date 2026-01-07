import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/products', label: 'Productos', icon: '📦' },
    { path: '/admin/orders', label: 'Pedidos', icon: '📋' },
    { path: '/admin/users', label: 'Usuarios', icon: '👥' },
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>Panel de Administración</h2>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="content">
        <header className="top-bar">
          <div className="user-info">
            <span>👤 Admin</span>
            <button className="btn-logout">Cerrar sesión</button>
          </div>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
