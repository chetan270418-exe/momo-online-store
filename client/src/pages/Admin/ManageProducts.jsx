import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Veg Momo',
    stock: 50,
    isAvailable: true,
    offer: { isActive: false, label: '', discount: 0, color: '#EF4444' }
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name, price: product.price, description: product.description,
        category: product.category, stock: product.stock, isAvailable: product.isAvailable,
        offer: product.offer || { isActive: false, label: '', discount: 0, color: '#EF4444' }
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', price: '', description: '', category: 'Veg Momo', stock: 50, isAvailable: true,
        offer: { isActive: false, label: '', discount: 0, color: '#EF4444' }
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.name.startsWith('offer.')) {
      const field = e.target.name.split('.')[1];
      setFormData({ ...formData, offer: { ...formData.offer, [field]: value } });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('isAvailable', formData.isAvailable);
    data.append('offer', JSON.stringify(formData.offer));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await updateProduct(editingId, data);
        toast.success('Product updated successfully');
      } else {
        await createProduct(data);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <AdminLayout><div className="text-center">Loading products...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex-between mb-4">
        <h1 style={{ fontFamily: 'var(--font-heading)' }}>Manage Products</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Product
        </button>
      </div>
      
      <div className="card" style={{overflowX: 'auto'}}>
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)'}}>
              <th style={{padding: '1rem'}}>Product</th>
              <th style={{padding: '1rem'}}>Category</th>
              <th style={{padding: '1rem'}}>Price</th>
              <th style={{padding: '1rem'}}>Stock</th>
              <th style={{padding: '1rem'}}>Status</th>
              <th style={{padding: '1rem'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{borderBottom: '1px solid var(--border)'}}>
                <td style={{padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <img src={product.image} alt={product.name} style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} />
                  <span style={{fontWeight: '500'}}>{product.name}</span>
                </td>
                <td style={{padding: '1rem'}}>{product.category}</td>
                <td style={{padding: '1rem', fontWeight: 'bold'}}>₹{product.price}</td>
                <td style={{padding: '1rem'}}>{product.stock}</td>
                <td style={{padding: '1rem'}}>
                  <span className={`badge ${product.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td style={{padding: '1rem'}}>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(product)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn btn-sm btn-outline text-danger" style={{borderColor: '#DC2626'}} onClick={() => handleDelete(product._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card glass" style={{width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="flex-between mb-4">
              <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="input" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" className="input" name="price" value={formData.price} onChange={handleChange} required min="0" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" className="input" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select className="select" name="category" value={formData.category} onChange={handleChange}>
                  <option value="Veg Momo">Veg Momo</option>
                  <option value="Chicken Momo">Chicken Momo</option>
                  <option value="Fried Momo">Fried Momo</option>
                  <option value="Steam Momo">Steam Momo</option>
                  <option value="Paneer Momo">Paneer Momo</option>
                  <option value="Special Momo">Special Momo</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea className="textarea" name="description" value={formData.description} onChange={handleChange} required rows="3"></textarea>
              </div>
              
              <div className="form-group">
                <label>Image Upload</label>
                <input type="file" className="input" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
                <small className="text-secondary mt-1 d-block">Leave empty to keep existing image</small>
              </div>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                <label htmlFor="isAvailable" style={{ margin: 0 }}>Available for Order</label>
              </div>

              {/* Offer Section */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input type="checkbox" id="offerActive" name="offer.isActive" checked={formData.offer.isActive} onChange={handleChange} />
                  <label htmlFor="offerActive" style={{ margin: 0, fontWeight: 'bold' }}>Enable Special Offer / Deal</label>
                </div>
                {formData.offer.isActive && (
                  <div className="grid grid-3" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label>Offer Label</label>
                      <input type="text" className="input" name="offer.label" value={formData.offer.label} onChange={handleChange} placeholder="e.g. 20% OFF" required />
                    </div>
                    <div className="form-group">
                      <label>Discount %</label>
                      <input type="number" className="input" name="offer.discount" value={formData.offer.discount} onChange={handleChange} min="0" max="100" required />
                    </div>
                    <div className="form-group">
                      <label>Badge Color</label>
                      <input type="color" className="input" name="offer.color" value={formData.offer.color} onChange={handleChange} style={{ height: '40px', padding: '2px' }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageProducts;
