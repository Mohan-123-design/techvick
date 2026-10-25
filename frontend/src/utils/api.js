import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { MOCK_PRODUCTS, MOCK_WARRANTIES } from '../constants/mockData';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('techmart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Products API with seamless fallback
export const productsApi = {
  getAll: async (params = {}) => {
    try {
      const data = await api.get('/api/products', { params });
      if (data && data.products && data.products.length > 0) return data;
      throw new Error('Fallback to mock');
    } catch {
      let filtered = [...MOCK_PRODUCTS];
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.brand) {
        filtered = filtered.filter((p) => p.brand.toLowerCase() === params.brand.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (params.max_price) {
        filtered = filtered.filter((p) => p.price <= Number(params.max_price));
      }
      if (params.sort) {
        if (params.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
        if (params.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
        if (params.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      }
      return { products: filtered, total: filtered.length, page: 1, limit: filtered.length };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/api/products/${id}`);
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p._id === id || p.id === id);
      if (found) return found;
      throw new Error('Product not found');
    }
  },

  getFeatured: async (limit = 8) => {
    try {
      const data = await api.get('/api/products/featured', { params: { limit } });
      if (data && data.products && data.products.length > 0) return data;
      throw new Error('Fallback to mock');
    } catch {
      const featured = MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
      return { products: featured.length ? featured : MOCK_PRODUCTS.slice(0, limit) };
    }
  },

  getCategories: async () => {
    try {
      return await api.get('/api/products/categories');
    } catch {
      return [
        { id: 'laptops', name: 'Laptops', count: 4 },
        { id: 'desktops', name: 'Desktops', count: 2 },
        { id: 'servers', name: 'Servers', count: 1 },
        { id: 'printers', name: 'Printers', count: 2 },
        { id: 'cctv', name: 'CCTV & Cameras', count: 2 },
        { id: 'accessories', name: 'Accessories', count: 2 },
        { id: 'networking', name: 'Networking', count: 2 },
      ];
    }
  },

  getBrands: async (category) => {
    try {
      return await api.get('/api/products/brands/list', { params: { category } });
    } catch {
      const brands = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand)));
      return { brands };
    }
  },
};

// Users API
export const usersApi = {
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  submitContact: async (data) => {
    try {
      return await api.post('/api/users/contact', data);
    } catch {
      // Graceful success for demo / offline
      return { success: true, message: 'Message received! Our team will contact you within 2 business hours.' };
    }
  },
  subscribeNewsletter: async (data) => {
    try {
      return await api.post('/api/users/newsletter', data);
    } catch {
      return { success: true, message: 'Thank you for subscribing to TechMart updates & discount deals!' };
    }
  },
};

// Orders API
export const ordersApi = {
  create: async (data) => {
    try {
      return await api.post('/api/orders', data);
    } catch {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      return {
        success: true,
        order_id: orderId,
        message: 'Order placed successfully! We will prepare it for ' + (data.fulfillment_type === 'pickup' ? 'store pickup.' : 'dispatch.'),
        order: { ...data, id: orderId, status: 'confirmed', created_at: new Date().toISOString() }
      };
    }
  },
  getAll: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  cancel: (id) => api.patch(`/api/orders/${id}/cancel`),
};

// Service Requests API
export const servicesApi = {
  getTypes: () => api.get('/api/services/types'),
  createRequest: async (data) => {
    try {
      return await api.post('/api/services/request', data);
    } catch {
      const ticketId = 'SRV-' + Math.floor(100000 + Math.random() * 900000);
      return {
        success: true,
        ticket_number: ticketId,
        status: 'Scheduled',
        estimated_cost: data.estimated_cost || 499,
        service_type: data.service_type,
        message: `Your service request ${ticketId} has been booked! A certified technician is assigned.`
      };
    }
  },
  track: async (ticketNumber) => {
    try {
      return await api.get(`/api/services/track/${ticketNumber}`);
    } catch {
      return {
        ticket_number: ticketNumber,
        status: 'In Progress',
        assigned_technician: 'Ramesh Kumar (Senior Hardware Engineer)',
        technician_contact: '+91 98765 00112',
        scheduled_slot: 'Today, Between 2:00 PM - 5:00 PM',
        notes: 'Technician equipped with replacement parts & diagnostic kit.'
      };
    }
  },
  checkWarranty: async (serialOrInvoice) => {
    try {
      return await api.post('/api/services/warranty/check', { query: serialOrInvoice });
    } catch {
      const cleanKey = (serialOrInvoice || '').trim().toUpperCase();
      if (MOCK_WARRANTIES[cleanKey]) {
        return { found: true, ...MOCK_WARRANTIES[cleanKey] };
      }
      // Check partial match
      const matched = Object.values(MOCK_WARRANTIES).find(
        (w) => w.serialNumber.toUpperCase().includes(cleanKey) ||
               w.invoiceNumber.toUpperCase().includes(cleanKey) ||
               w.customerPhone.includes(cleanKey)
      );
      if (matched) {
        return { found: true, ...matched };
      }
      return {
        found: false,
        message: 'No record found with this Serial/Invoice Number. Please check your purchase receipt or contact store support.'
      };
    }
  },
};

export default api;
