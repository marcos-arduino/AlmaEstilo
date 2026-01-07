import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
        toast.success('Producto eliminado correctamente');
      } catch (err) {
        toast.error('Error al eliminar el producto');
        console.error('Error deleting product:', err);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(`/api/products/${id}`, {
        isActive: !currentStatus
      });
      
      setProducts(products.map(product => 
        product._id === id ? { ...product, isActive: data.isActive } : product
      ));
      
      toast.success(`Producto ${data.isActive ? 'activado' : 'pausado'} correctamente`);
    } catch (err) {
      toast.error('Error al actualizar el estado del producto');
      console.error('Error toggling product status:', err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="header">
        <h1>Lista de Productos</h1>
        <Link to="/admin/products/new" className="btn-primary">
          + Nuevo Producto
        </Link>
      </div>

      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay productos registrados</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.image || '/placeholder-product.jpg'} 
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price?.toFixed(2)}</td>
                  <td>{product.stock || 0}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link 
                      to={`/admin/products/edit/${product._id}`}
                      className="btn-edit"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => toggleStatus(product._id, product.isActive)}
                      className={`btn-status ${product.isActive ? 'pause' : 'activate'}`}
                    >
                      {product.isActive ? 'Pausar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
