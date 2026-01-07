import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: null, // Hacer la categoría opcional
    isActive: true,
    image: null,
    previewImage: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Error al cargar las categorías');
      }
    };

    const fetchProduct = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setFormData({
          ...data,
          previewImage: data.image || ''
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Error al cargar el producto');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (isEditMode) fetchProduct();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        previewImage: URL.createObjectURL(file)
      });
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploading(true);
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return data.imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      let imageUrl = formData.previewImage;
      
      // Subir nueva imagen si se seleccionó una
      if (formData.image && typeof formData.image !== 'string') {
        imageUrl = await uploadImage(formData.image);
      }
      
      const productData = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };
      
      if (isEditMode) {
        await axios.put(`/api/products/${id}`, productData);
        toast.success('Producto actualizado correctamente');
      } else {
        await axios.post('/api/products', productData);
        toast.success('Producto creado correctamente');
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err.response?.data?.error || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Cargando producto...</div>;
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
        <button 
          onClick={() => navigate('/admin/products')}
          className="btn-secondary"
        >
          Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Camiseta de algodón"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
            >
              <option value="">Sin categoría (opcional)</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Precio (USD) *</label>
            <div className="input-with-symbol">
              <span className="symbol">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              placeholder="Cantidad en inventario"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Describe el producto en detalle..."
          />
        </div>

        <div className="form-group">
          <label>Imagen del Producto</label>
          <div className="image-upload-container">
            <div className="image-preview">
              {formData.previewImage ? (
                <img 
                  src={formData.previewImage} 
                  alt="Vista previa" 
                  className="preview-image"
                />
              ) : (
                <div className="no-image">
                  <span>Sin imagen</span>
                </div>
              )}
            </div>
            <label className="file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <span className="btn-upload">
                {formData.previewImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </span>
              <span className="file-name">
                {formData.image?.name || 'Ningún archivo seleccionado'}
              </span>
            </label>
            <p className="file-hint">
              Formatos soportados: JPG, PNG. Tamaño máximo: 5MB
            </p>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">
            Producto activo (visible en la tienda)
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-cancel"
            disabled={loading || uploading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || uploading}
          >
            {loading ? 'Guardando...' : uploading ? 'Subiendo imagen...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
