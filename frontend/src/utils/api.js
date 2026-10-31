import axios from 'axios';
import { API_BASE_URL } from '../constants';
import {
  MOCK_WARRANTIES,
  getLocalProducts,
  saveLocalProducts,
  getLocalOrders,
  saveLocalOrders,
  getLocalServiceRequests,
  saveLocalServiceRequests,
  getLocalInquiries,
  saveLocalInquiries,
} from '../constants/mockData';

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

// ==========================================
// 1. PRODUCTS API (Public View + Admin CRUD)
// ==========================================
export const productsApi = {
  getAll: async (params = {}) => {
    try {
      const data = await api.get('/api/products', { params });
      if (data && data.products && data.products.length > 0) return data;
      throw new Error('Fallback to mock');
    } catch {
      let filtered = getLocalProducts();
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category?.toLowerCase() === params.category.toLowerCase());
      }
      if (params.brand && params.brand !== 'all') {
        filtered = filtered.filter((p) => p.brand?.toLowerCase() === params.brand.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
        );
      }
      if (params.max_price) {
        filtered = filtered.filter((p) => p.price <= Number(params.max_price));
      }
      if (params.sort) {
        if (params.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
        if (params.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
        if (params.sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      return { products: filtered, total: filtered.length, page: 1, limit: filtered.length };
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/api/products/${id}`);
    } catch {
      const products = getLocalProducts();
      const found = products.find((p) => (p._id || p.id) === id);
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
      const products = getLocalProducts();
      const featured = products.filter((p) => p.is_featured).slice(0, limit);
      return { products: featured.length ? featured : products.slice(0, limit) };
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
      const products = getLocalProducts();
      const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
      return { brands };
    }
  },

  // Admin CRUD: Create
  create: async (productData) => {
    try {
      return await api.post('/api/products', productData);
    } catch {
      const products = getLocalProducts();
      const newProduct = {
        ...productData,
        _id: 'prod-local-' + Date.now(),
        rating: 4.8,
        review_count: 1,
        created_at: new Date().toISOString(),
      };
      products.unshift(newProduct);
      saveLocalProducts(products);
      return { product: newProduct, message: 'Product created successfully' };
    }
  },

  // Admin CRUD: Update
  update: async (productId, updateData) => {
    try {
      return await api.put(`/api/products/${productId}`, updateData);
    } catch {
      const products = getLocalProducts();
      const index = products.findIndex((p) => (p._id || p.id) === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updateData, updated_at: new Date().toISOString() };
        saveLocalProducts(products);
        return { product: products[index], message: 'Product updated successfully' };
      }
      throw new Error('Product not found in store');
    }
  },

  // Admin CRUD: Delete
  delete: async (productId) => {
    try {
      return await api.delete(`/api/products/${productId}`);
    } catch {
      const products = getLocalProducts();
      const filtered = products.filter((p) => (p._id || p.id) !== productId);
      saveLocalProducts(filtered);
      return { message: 'Product deleted successfully' };
    }
  },
};

// ==========================================
// 2. USERS & AUTH API
// ==========================================
export const usersApi = {
  register: async (data) => {
    try {
      return await api.post('/api/users/register', data);
    } catch {
      // Mock registration fallback
      const token = 'mock_jwt_token_' + Date.now();
      const user = {
        id: 'usr-' + Date.now(),
        name: data.name,
        email: data.email,
        role: 'customer',
      };
      return { message: 'Registration successful', token, user };
    }
  },

  login: async (credentials) => {
    try {
      return await api.post('/api/users/login', credentials);
    } catch {
      // Mock login fallback
      const email = (credentials.email || '').toLowerCase().trim();
      const isAdmin = email.includes('admin');
      const token = 'mock_jwt_token_' + (isAdmin ? 'admin' : 'customer') + '_' + Date.now();
      const user = {
        id: isAdmin ? 'admin-001' : 'usr-' + Date.now(),
        name: isAdmin ? 'Store Administrator' : 'Rahul Sharma',
        email: credentials.email,
        role: isAdmin ? 'admin' : 'customer',
      };
      return { message: 'Login successful', token, user };
    }
  },

  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),

  submitContact: async (data) => {
    try {
      return await api.post('/api/users/contact', data);
    } catch {
      const inquiries = getLocalInquiries();
      const newInq = {
        _id: 'inq-' + Date.now(),
        ...data,
        status: 'new',
        created_at: new Date().toISOString(),
      };
      inquiries.unshift(newInq);
      saveLocalInquiries(inquiries);
      return { message: "Thank you for contacting us! We'll get back to you within 2 hours." };
    }
  },

  subscribeNewsletter: async (data) => {
    try {
      return await api.post('/api/users/newsletter', data);
    } catch {
      return { message: 'Successfully subscribed to our newsletter!' };
    }
  },

  // Admin Inquiries Management
  getInquiriesAdmin: async (params = {}) => {
    try {
      return await api.get('/api/users/inquiries', { params });
    } catch {
      let inquiries = getLocalInquiries();
      if (params.status && params.status !== 'all') {
        inquiries = inquiries.filter((i) => i.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        inquiries = inquiries.filter(
          (i) => (i.name || '').toLowerCase().includes(q) || (i.message || '').toLowerCase().includes(q)
        );
      }
      return { inquiries, total: inquiries.length };
    }
  },

  updateInquiryStatus: async (inquiryId, status, responseNote = '') => {
    try {
      return await api.patch(`/api/users/inquiries/${inquiryId}/status`, null, {
        params: { new_status: status, response_note: responseNote },
      });
    } catch {
      const inquiries = getLocalInquiries();
      const item = inquiries.find((i) => i._id === inquiryId);
      if (item) {
        item.status = status;
        if (responseNote) item.response_note = responseNote;
        saveLocalInquiries(inquiries);
        return { inquiry: item, message: `Inquiry marked as ${status}` };
      }
      throw new Error('Inquiry not found');
    }
  },

  getAllUsersAdmin: async (params = {}) => {
    try {
      return await api.get('/api/users/all', { params });
    } catch {
      return {
        users: [
          { id: 'u1', name: 'Store Administrator', email: 'admin@techmart.in', role: 'admin', phone: '+91 98765 00000' },
          { id: 'u2', name: 'Rahul Sharma', email: 'customer@techmart.in', role: 'customer', phone: '+91 98765 43210' },
          { id: 'u3', name: 'Priya Verma', email: 'priya.v@example.com', role: 'customer', phone: '+91 98401 22334' },
        ],
        total: 3,
      };
    }
  },
};

// ==========================================
// 3. ORDERS API (Customer Checkout + Admin)
// ==========================================
export const ordersApi = {
  create: async (data) => {
    try {
      return await api.post('/api/orders', data);
    } catch {
      const orderId = 'TM-2026-X' + Math.floor(10000 + Math.random() * 90000);
      const orders = getLocalOrders();
      const newOrder = {
        _id: 'ord-' + Date.now(),
        order_number: orderId,
        customer_name: data.customer_name || 'Customer',
        customer_phone: data.customer_phone || '+91 98765 43210',
        customer_email: data.customer_email || '',
        fulfillment_type: data.fulfillment_type || 'pickup',
        shipping_address: data.delivery_address || 'In-Store Pickup',
        payment_method: data.payment_method || 'cod',
        total: data.total_amount || 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        items: data.items || [],
      };
      orders.unshift(newOrder);
      saveLocalOrders(orders);
      return {
        success: true,
        order_id: orderId,
        order: newOrder,
        message: 'Order placed successfully!',
      };
    }
  },

  getMyOrders: async (params) => {
    try {
      return await api.get('/api/orders', { params });
    } catch {
      const orders = getLocalOrders();
      return { orders, total: orders.length };
    }
  },

  getAllAdmin: async (params = {}) => {
    try {
      return await api.get('/api/orders/all', { params });
    } catch {
      let orders = getLocalOrders();
      if (params.status && params.status !== 'all') {
        orders = orders.filter((o) => o.status === params.status);
      }
      if (params.fulfillment && params.fulfillment !== 'all') {
        orders = orders.filter((o) => o.fulfillment_type === params.fulfillment);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            (o.order_number || '').toLowerCase().includes(q) ||
            (o.customer_name || '').toLowerCase().includes(q) ||
            (o.customer_phone || '').toLowerCase().includes(q)
        );
      }
      return { orders, total: orders.length };
    }
  },

  updateStatus: async (orderId, newStatus, adminNotes = '') => {
    try {
      return await api.patch(`/api/orders/${orderId}/status`, {
        status: newStatus,
        admin_notes: adminNotes,
      });
    } catch {
      const orders = getLocalOrders();
      const order = orders.find((o) => (o._id || o.order_number) === orderId);
      if (order) {
        order.status = newStatus;
        if (adminNotes) order.admin_notes = adminNotes;
        saveLocalOrders(orders);
        return { order, message: `Order status updated to ${newStatus}` };
      }
      throw new Error('Order not found');
    }
  },

  cancel: (id) => api.patch(`/api/orders/${id}/cancel`),
};

// ==========================================
// 4. SERVICE REQUESTS & SITE VISITS API
// ==========================================
export const servicesApi = {
  getTypes: () => api.get('/api/services/types'),

  createRequest: async (data) => {
    try {
      return await api.post('/api/services/request', data);
    } catch {
      const ticketId = 'SRV-' + Math.floor(100000 + Math.random() * 900000);
      const requests = getLocalServiceRequests();
      const newRequest = {
        _id: 'srv-' + Date.now(),
        ticket_number: ticketId,
        service_mode: data.serviceMode || data.service_type || 'site_visit',
        device_type: data.deviceType || 'laptop',
        brand: data.brand || '',
        model: data.model || '',
        issue_category: data.issueCategory || 'general_repair',
        issue_description: data.issueDescription || '',
        customer_name: data.customerName || 'Customer',
        customer_phone: data.customerPhone || '',
        address: data.address || '',
        status: 'submitted',
        estimated_cost: data.estimated_cost || 499,
        preferred_date: data.preferredDate || new Date().toISOString().split('T')[0],
        preferred_time_slot: data.preferredTimeSlot || '10:00 AM - 01:00 PM',
        created_at: new Date().toISOString(),
      };
      requests.unshift(newRequest);
      saveLocalServiceRequests(requests);
      return {
        success: true,
        ticket_number: ticketId,
        service_request: newRequest,
        message: `Your service request ${ticketId} has been booked!`,
      };
    }
  },

  track: async (ticketNumber) => {
    try {
      return await api.get(`/api/services/track/${ticketNumber}`);
    } catch {
      const requests = getLocalServiceRequests();
      const found = requests.find((r) => r.ticket_number?.toUpperCase() === ticketNumber?.toUpperCase());
      if (found) return { service_request: found };
      return {
        ticket_number: ticketNumber,
        status: 'In Progress',
        assigned_technician: 'Ramesh Kumar (Senior Hardware Engineer)',
        technician_contact: '+91 98765 00112',
        scheduled_slot: 'Today, Between 2:00 PM - 5:00 PM',
        notes: 'Technician equipped with replacement parts & diagnostic kit.',
      };
    }
  },

  getAllAdmin: async (params = {}) => {
    try {
      return await api.get('/api/services/requests', { params });
    } catch {
      let requests = getLocalServiceRequests();
      if (params.status_filter && params.status_filter !== 'all') {
        requests = requests.filter((r) => r.status === params.status_filter);
      }
      if (params.service_type && params.service_type !== 'all') {
        requests = requests.filter(
          (r) => (r.service_mode || r.service_type) === params.service_type
        );
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        requests = requests.filter(
          (r) =>
            (r.ticket_number || '').toLowerCase().includes(q) ||
            (r.customer_name || '').toLowerCase().includes(q) ||
            (r.brand || '').toLowerCase().includes(q)
        );
      }
      return { service_requests: requests, total: requests.length };
    }
  },

  updateStatus: async (requestId, newStatus) => {
    try {
      return await api.patch(`/api/services/requests/${requestId}/status`, null, {
        params: { new_status: newStatus },
      });
    } catch {
      const requests = getLocalServiceRequests();
      const item = requests.find((r) => r._id === requestId || r.ticket_number === requestId);
      if (item) {
        item.status = newStatus;
        saveLocalServiceRequests(requests);
        return { service_request: item, message: `Status updated to ${newStatus}` };
      }
      throw new Error('Service request not found');
    }
  },

  assignTechnician: async (requestId, assignmentData) => {
    try {
      return await api.patch(`/api/services/requests/${requestId}/assign`, assignmentData);
    } catch {
      const requests = getLocalServiceRequests();
      const item = requests.find((r) => r._id === requestId || r.ticket_number === requestId);
      if (item) {
        item.assigned_technician = assignmentData.technician_name;
        item.technician_phone = assignmentData.technician_phone;
        item.status = 'assigned';
        if (assignmentData.estimated_cost) item.estimated_cost = assignmentData.estimated_cost;
        if (assignmentData.scheduled_slot) item.scheduled_slot = assignmentData.scheduled_slot;
        saveLocalServiceRequests(requests);
        return { service_request: item, message: 'Technician assigned successfully' };
      }
      throw new Error('Service request not found');
    }
  },

  // Warranty
  checkWarranty: async (serialOrInvoice) => {
    try {
      return await api.post('/api/services/warranty/check', { product_serial: serialOrInvoice });
    } catch {
      const cleanKey = (serialOrInvoice || '').trim().toUpperCase();
      if (MOCK_WARRANTIES[cleanKey]) {
        return { found: true, ...MOCK_WARRANTIES[cleanKey] };
      }
      const matched = Object.values(MOCK_WARRANTIES).find(
        (w) =>
          w.serialNumber.toUpperCase().includes(cleanKey) ||
          w.invoiceNumber.toUpperCase().includes(cleanKey) ||
          w.customerPhone.includes(cleanKey)
      );
      if (matched) return { found: true, ...matched };
      return {
        found: false,
        message: 'No record found with this Serial/Invoice Number. Please check your purchase receipt or contact store support.',
      };
    }
  },

  submitClaim: async (data) => {
    try {
      return await api.post('/api/services/warranty/claim', data);
    } catch {
      return {
        success: true,
        claim_id: 'WCL-' + Math.floor(100000 + Math.random() * 900000),
        message: 'Warranty claim submitted successfully!',
      };
    }
  },

  getClaimsAdmin: async (params = {}) => {
    try {
      return await api.get('/api/services/warranty/claims', { params });
    } catch {
      return {
        claims: [
          {
            _id: 'clm-01',
            claim_id: 'WCL-781923',
            serial_number: 'TM-LAP-2024-001',
            product_name: 'HP ProBook 450 G10',
            customer_name: 'Suresh Raina',
            customer_phone: '+91 98765 11223',
            fault_description: 'Screen hinge loose and left USB-C port not charging.',
            claim_type: 'doorstep_pickup',
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
        ],
        total: 1,
      };
    }
  },

  updateClaimStatus: async (claimId, newStatus, notes = '') => {
    try {
      return await api.patch(`/api/services/warranty/claims/${claimId}/status`, null, {
        params: { new_status: newStatus, notes },
      });
    } catch {
      return { message: `Claim updated to ${newStatus}` };
    }
  },
};

export default api;
