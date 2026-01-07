import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    price: '',
    imageFile: null,
    imagePreview: ''
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [edit, setEdit] = useState({
    id: null,
    name: '',
    price: '',
    image: '',
    imageFile: null,
    imagePreview: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const baseUrl = useMemo(() => (axios.defaults.baseURL || '').replace(/\/+$/, ''), []);
  const getImageSrc = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/img/')) return `${baseUrl}${image}`;
    if (image.startsWith('img/')) return `${baseUrl}/${image}`;
    return `${baseUrl}/img/${image.replace(/^\/+/, '')}`;
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/products');
      const list = Array.isArray(data) ? data : data?.products || [];
      // Solo activos
      setProducts(list.filter(p => p.isActive !== false));
    } catch (e) {
      setError(e?.response?.data?.error || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await axios.post('/api/upload', fd, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
    return data.imageUrl;
  };

  const handleCreateChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files?.[0];
      setForm(prev => ({
        ...prev,
        imageFile: file || null,
        imagePreview: file ? URL.createObjectURL(file) : ''
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.imageFile) {
      alert('Completa nombre, precio e imagen');
      return;
    }
    try {
      setCreating(true);
      let imageUrl = '';
      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
      }
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        image: imageUrl
      };
      const { data } = await axios.post('/api/products', payload, { headers: getAuthHeaders() });
      setProducts(prev => [data, ...prev]);
      setForm({ name: '', price: '', imageFile: null, imagePreview: '' });
    } catch (e) {
      alert(e?.response?.data?.error || 'Error al crear producto');
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (p) => {
    setEdit({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image || '',
      imageFile: null,
      imagePreview: ''
    });
    setModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files?.[0];
      setEdit(prev => ({
        ...prev,
        imageFile: file || null,
        imagePreview: file ? URL.createObjectURL(file) : ''
      }));
    } else {
      setEdit(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = edit.image || '';
      if (edit.imageFile) {
        imageUrl = await uploadImage(edit.imageFile);
      }
      const payload = {
        name: edit.name,
        price: parseFloat(edit.price),
        image: imageUrl
      };
      const { data } = await axios.put(`/api/products/${edit.id}`, payload, { headers: getAuthHeaders() });
      setProducts(prev => prev.map(p => p._id === edit.id ? { ...p, ...data } : p));
      setModalOpen(false);
    } catch (e) {
      alert(e?.response?.data?.error || 'Error al actualizar producto');
    }
  };

  const toggleStatus = async (p) => {
    try {
      const { data } = await axios.put(`/api/admin/products/${p._id}`, { isActive: !p.isActive }, { headers: getAuthHeaders() });
      // Si se pausó, sacarlo de la lista (solo mostramos activos)
      setProducts(prev => prev.filter(x => x._id !== p._id || data.isActive));
      if (!data.isActive) {
        setProducts(prev => prev.filter(x => x._id !== p._id));
      } else {
        setProducts(prev => prev.map(x => x._id === p._id ? { ...x, isActive: true } : x));
      }
    } catch (e) {
      alert(e?.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const removeProduct = async (p) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await axios.delete(`/api/products/${p._id}`, { headers: getAuthHeaders() });
      setProducts(prev => prev.filter(x => x._id !== p._id));
    } catch (e) {
      alert(e?.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="card">
        <h2>Nuevo producto</h2>
        <form onSubmit={handleCreateSubmit} className="form-grid">
          <div className="form-field">
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={handleCreateChange} placeholder="Ej: Remera" required />
          </div>
          <div className="form-field">
            <label>Precio</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleCreateChange} placeholder="0.00" required />
          </div>
          <div className="form-field">
            <label>Imagen</label>
            <input name="image" type="file" accept="image/*" onChange={handleCreateChange} required />
            {form.imagePreview && <img src={form.imagePreview} alt="preview" className="thumb" />}
          </div>
          <div className="actions">
            <button type="submit" className="btn-primary" disabled={creating}>{creating ? 'Creando...' : 'Crear'}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="table-header">
          <h2>Productos activos</h2>
          <button className="btn-refresh" onClick={fetchProducts} disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar'}</button>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="4" className="empty">Sin productos activos</td></tr>
              ) : products.map(p => (
                <tr key={p._id}>
                  <td><img className="thumb" src={getImageSrc(p.image)} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>${Number(p.price || 0).toFixed(2)}</td>
                  <td className="row-actions">
                    <button className="btn" onClick={() => openEdit(p)}>Editar</button>
                    <button className="btn warning" onClick={() => toggleStatus(p)}>{p.isActive ? 'Pausar' : 'Activar'}</button>
                    <button className="btn danger" onClick={() => removeProduct(p)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar producto</h3>
              <button className="close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="form-grid">
              <div className="form-field">
                <label>Nombre</label>
                <input name="name" value={edit.name} onChange={handleEditChange} required />
              </div>
              <div className="form-field">
                <label>Precio</label>
                <input name="price" type="number" min="0" step="0.01" value={edit.price} onChange={handleEditChange} required />
              </div>
              <div className="form-field">
                <label>Imagen</label>
                <input name="image" type="file" accept="image/*" onChange={handleEditChange} />
                {(edit.imagePreview || edit.image) && (
                  <img className="thumb" src={edit.imagePreview || getImageSrc(edit.image)} alt="preview" />
                )}
              </div>
              <div className="actions">
                <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
