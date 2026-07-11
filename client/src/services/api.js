import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => api.post('/auth/register', data).then(res => res.data);
export const loginUser = (data) => api.post('/auth/login', data).then(res => res.data);
export const getProfile = () => api.get('/auth/profile').then(res => res.data);
export const updateProfile = (data) => api.put('/auth/profile', data).then(res => res.data);

// Products
export const getProducts = (params) => api.get('/products', { params }).then(res => res.data);
export const getProductById = (id) => api.get(`/products/${id}`).then(res => res.data);
export const createProduct = (data) => api.post('/products', data).then(res => res.data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data).then(res => res.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(res => res.data);
export const createReview = (id, data) => api.post(`/products/${id}/reviews`, data).then(res => res.data);

// Cart
export const getCart = () => api.get('/cart').then(res => res.data);
export const addToCart = (productId, quantity) => api.post('/cart', { productId, quantity }).then(res => res.data);
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`).then(res => res.data);
export const clearCart = () => api.delete('/cart/clear').then(res => res.data);

// Orders
export const createOrder = (data) => api.post('/orders', data).then(res => res.data);
export const getMyOrders = (page) => api.get('/orders/my', { params: { page } }).then(res => res.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then(res => res.data);

// Admin
export const getAdminOrders = (page, status) => api.get('/admin/orders', { params: { page, status } }).then(res => res.data);
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}`, { status }).then(res => res.data);
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}`).then(res => res.data);
export const getStaff = (page = 1, search = '') => api.get('/admin/staff', { params: { page, search } }).then(res => res.data);
export const createStaff = (data) => api.post('/admin/staff', data).then(res => res.data);
export const deleteStaff = (id) => api.delete(`/admin/staff/${id}`).then(res => res.data);
export const getStats = () => api.get('/admin/stats').then(res => res.data);

// Staff Kitchen Panel
export const getKitchenOrders = () => api.get('/staff/orders').then(res => res.data);
export const updateKitchenOrderStatus = (id, status) => api.put(`/staff/orders/${id}`, { status }).then(res => res.data);

export default api;
