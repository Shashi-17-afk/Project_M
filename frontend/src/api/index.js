import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getCart = () => api.get('/cart');
export const updateCartItem = (data) => api.post('/cart', data);
export const removeCartItem = (productId) => api.delete(`/cart/${productId}`);
export const clearCartApi = () => api.delete('/cart');

export const getOrders = () => api.get('/orders');
export const placeOrder = (data) => api.post('/orders', data);

export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;
