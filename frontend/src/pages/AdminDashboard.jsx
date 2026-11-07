import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Wrench, MessageSquare, Shield,
  Plus, Edit, Trash2, Search, Phone,
  Mail, MapPin, Eye, X, RefreshCw,
  UserCheck
} from 'lucide-react';
import { productsApi, ordersApi, servicesApi, usersApi } from '../utils/api';
import { CATEGORIES } from '../constants';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, services, inquiries, warranty

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = creating new
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(null);

  // Forms
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'laptops',
    brand: '',
    price: '',
    original_price: '',
    stock: 10,
    warranty_months: 24,
    badge: '',
    description: '',
    inStoreAvailability: 'Available at Main Store',
    specProcessor: '',
    specRAM: '',
    specStorage: '',
    specDisplay: '',
  });

  const [assignForm, setAssignForm] = useState({
    technician_name: 'Ramesh Kumar (Senior Hardware Engineer)',
    technician_phone: '+91 98765 00112',
    estimated_cost: 499,
    scheduled_slot: 'Today, 2:00 PM - 5:00 PM',
    notes: 'Technician equipped with diagnostics tool and genuine spares.',
  });

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, srvRes, inqRes] = await Promise.all([
        productsApi.getAll({ limit: 100 }),
        ordersApi.getAllAdmin(),
        servicesApi.getAllAdmin(),
        usersApi.getInquiriesAdmin(),
      ]);

      setProducts(prodRes.products || []);
      setOrders(ordRes.orders || []);
      setServiceRequests(srvRes.service_requests || []);
      setInquiries(inqRes.inquiries || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Format INR Price
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // ==========================================
  // PRODUCT CRUD HANDLERS
  // ==========================================
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        category: product.category || 'laptops',
        brand: product.brand || '',
        price: product.price || '',
        original_price: product.original_price || '',
        stock: product.stock !== undefined ? product.stock : 10,
        warranty_months: product.warranty_months || 24,
        badge: product.badge || '',
        description: product.description || '',
        inStoreAvailability: product.inStoreAvailability || 'Available at Main Store',
        specProcessor: product.specifications?.['Processor'] || '',
        specRAM: product.specifications?.['RAM'] || '',
        specStorage: product.specifications?.['Storage'] || '',
        specDisplay: product.specifications?.['Display'] || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: 'laptops',
        brand: '',
        price: '',
        original_price: '',
        stock: 10,
        warranty_months: 24,
        badge: '',
        description: '',
        inStoreAvailability: 'Available at Main Store',
        specProcessor: '',
        specRAM: '',
        specStorage: '',
        specDisplay: '',
      });
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      toast.error('Product Name and Price are required');
      return;
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      brand: productForm.brand,
      price: Number(productForm.price),
      original_price: productForm.original_price ? Number(productForm.original_price) : undefined,
      stock: Number(productForm.stock),
      warranty_months: Number(productForm.warranty_months),
      badge: productForm.badge || undefined,
      description: productForm.description,
      inStoreAvailability: productForm.inStoreAvailability,
      specifications: {
        ...(productForm.specProcessor ? { Processor: productForm.specProcessor } : {}),
        ...(productForm.specRAM ? { RAM: productForm.specRAM } : {}),
        ...(productForm.specStorage ? { Storage: productForm.specStorage } : {}),
        ...(productForm.specDisplay ? { Display: productForm.specDisplay } : {}),
      },
    };

    try {
      if (editingProduct) {
        const pId = editingProduct._id || editingProduct.id;
        await productsApi.update(pId, payload);
        toast.success(`Updated "${productForm.name}" successfully!`);
      } else {
        await productsApi.create(payload);
        toast.success(`Created "${productForm.name}" in catalog!`);
      }
      setProductModalOpen(false);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (product) => {
    const pId = product._id || product.id;
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productsApi.delete(pId);
        toast.success(`Deleted "${product.name}"`);
        loadDashboardData();
      } catch (err) {
        toast.error(err.message || 'Error deleting product');
      }
    }
  };

  // ==========================================
  // ORDER STATUS HANDLERS
  // ==========================================
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast.success(`Order ${orderId} marked as ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  // ==========================================
  // SERVICE REQUEST & SITE VISIT HANDLERS
  // ==========================================
  const handleServiceStatusChange = async (requestId, newStatus) => {
    try {
      await servicesApi.updateStatus(requestId, newStatus);
      toast.success(`Service ticket updated to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update service status');
    }
  };

  const handleOpenAssignModal = (request) => {
    setSelectedService(request);
    setAssignForm({
      technician_name: request.assigned_technician || 'Ramesh Kumar (Senior Hardware Engineer)',
      technician_phone: request.technician_phone || '+91 98765 00112',
      estimated_cost: request.estimated_cost || 499,
      scheduled_slot: request.preferred_time_slot || 'Today, 2:00 PM - 5:00 PM',
      notes: 'Field technician dispatched with spare diagnostic kit.',
    });
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;
    const reqId = selectedService._id || selectedService.ticket_number;
    try {
      await servicesApi.assignTechnician(reqId, assignForm);
      toast.success(`Assigned ${assignForm.technician_name} to ticket ${selectedService.ticket_number}`);
      setAssignModalOpen(false);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to assign technician');
    }
  };

  // ==========================================
  // INQUIRIES HANDLER
  // ==========================================
  const handleInquiryStatusChange = async (inquiryId, newStatus) => {
    try {
      await usersApi.updateInquiryStatus(inquiryId, newStatus);
      toast.success(`Inquiry marked as ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update inquiry status');
    }
  };

  // Filtered Lists
  const filteredProducts = products.filter((p) => {
    const matchCat = productCategory === 'all' || p.category?.toLowerCase() === productCategory.toLowerCase();
    const matchSearch =
      !productSearch ||
      (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredOrders = orders.filter((o) => {
    return orderStatusFilter === 'all' || o.status === orderStatusFilter;
  });

  const filteredServices = serviceRequests.filter((s) => {
    return serviceStatusFilter === 'all' || s.status === serviceStatusFilter;
  });

  const filteredInquiries = inquiries.filter((i) => {
    return inquiryStatusFilter === 'all' || i.status === inquiryStatusFilter;
  });

  // Overview Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const activeServiceVisits = serviceRequests.filter(
    (s) => s.status === 'submitted' || s.status === 'assigned' || s.status === 'in_progress'
  ).length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-header-title">
            <span className="admin-badge">
              <Shield size={14} /> Techvick Computers • Tatabad Store Portal
            </span>
            <h1>Store Management & Customer Requests</h1>
            <p>
              Dedicated Store Staff Portal: Service Bookings, Customer Inquiries & Quotes, Order Fulfillment, and Real Market Inventory.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm refresh-btn" onClick={loadDashboardData} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Sync Data</span>
          </button>
        </div>
      </header>

      <div className="container admin-container">
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products CRUD ({products.length})</span>
          </button>

          <button
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={18} />
            <span>Orders & Cart ({orders.length})</span>
            {pendingOrders > 0 && <span className="tab-pill green">{pendingOrders}</span>}
          </button>

          <button
            className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Wrench size={18} />
            <span>Service & Site Visits ({serviceRequests.length})</span>
            {activeServiceVisits > 0 && <span className="tab-pill blue">{activeServiceVisits}</span>}
          </button>

          <button
            className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <MessageSquare size={18} />
            <span>User Queries ({inquiries.length})</span>
            {newInquiriesCount > 0 && <span className="tab-pill amber">{newInquiriesCount}</span>}
          </button>
        </div>

        {/* ============================================================ */}
        {/* 1. OVERVIEW TAB */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content animate-fadeIn">
            {/* Metric Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon blue">
                  <Package size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Products in Catalog</span>
                  <span className="metric-val">{products.length} Items</span>
                  <span className="metric-sub">Computers, Printers & CCTV</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon green">
                  <ShoppingCart size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Total Customer Orders</span>
                  <span className="metric-val">{orders.length} Orders (₹{totalRevenue.toLocaleString('en-IN')})</span>
                  <span className="metric-sub">{pendingOrders} Pending Fulfillment</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon amber">
                  <Wrench size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Service & Site Visits</span>
                  <span className="metric-val">{serviceRequests.length} Bookings</span>
                  <span className="metric-sub">{activeServiceVisits} In Progress / Assigned</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon purple">
                  <MessageSquare size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Customer Queries</span>
                  <span className="metric-val">{inquiries.length} Inquiries</span>
                  <span className="metric-sub">{newInquiriesCount} Awaiting Response</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activities */}
            <div className="overview-two-col">
              {/* Quick Actions */}
              <div className="admin-box">
                <h3>⚡ Store Management Shortcuts</h3>
                <p className="admin-box-sub">Direct access to frequent administrative tasks</p>
                <div className="quick-actions-grid">
                  <button className="quick-act-btn" onClick={() => { setActiveTab('products'); handleOpenProductModal(); }}>
                    <Plus size={18} />
                    <div>
                      <strong>Add New Product</strong>
                      <span>Create hardware listing with specs</span>
                    </div>
                  </button>

                  <button className="quick-act-btn" onClick={() => setActiveTab('orders')}>
                    <ShoppingCart size={18} />
                    <div>
                      <strong>Review Orders</strong>
                      <span>Process pickup & doorstep deliveries</span>
                    </div>
                  </button>

                  <button className="quick-act-btn" onClick={() => setActiveTab('services')}>
                    <UserCheck size={18} />
                    <div>
                      <strong>Assign Site Technicians</strong>
                      <span>Allocate engineers for home visits</span>
                    </div>
                  </button>

                  <button className="quick-act-btn" onClick={() => setActiveTab('inquiries')}>
                    <MessageSquare size={18} />
                    <div>
                      <strong>Respond to User Inquiries</strong>
                      <span>Quote requests & bulk buying queries</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="admin-box">
                <div className="admin-box-header">
                  <h3>Recent Customer Orders</h3>
                  <button className="link-btn" onClick={() => setActiveTab('orders')}>
                    View All ({orders.length})
                  </button>
                </div>
                <div className="recent-orders-list">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o._id || o.order_number} className="recent-order-row">
                      <div>
                        <strong>{o.order_number}</strong>
                        <p>{o.customer_name} • {o.items?.length || 1} items</p>
                      </div>
                      <div className="ro-right">
                        <span className="ro-price">{formatPrice(o.total)}</span>
                        <span className={`status-pill ${o.status}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="empty-hint">No orders placed yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. PRODUCTS MANAGEMENT (FULL CRUD) */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="admin-tab-content animate-fadeIn">
            <div className="tab-action-bar">
              <div className="action-search-group">
                <div className="admin-search-wrap">
                  <Search size={16} className="as-icon" />
                  <input
                    type="text"
                    placeholder="Search product name, brand, model..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {productSearch && <button onClick={() => setProductSearch('')}><X size={14} /></button>}
                </div>

                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary" onClick={() => handleOpenProductModal()}>
                <Plus size={16} /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Warranty</th>
                    <th>Store Availability</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const pId = p._id || p.id;
                    return (
                      <tr key={pId}>
                        <td>
                          <div className="table-product-cell">
                            <strong>{p.name}</strong>
                            {p.badge && <span className="prod-badge-tag">{p.badge}</span>}
                          </div>
                        </td>
                        <td>
                          <span className="cat-chip">{p.category?.toUpperCase()}</span>
                        </td>
                        <td>{p.brand}</td>
                        <td>
                          <div className="table-price">
                            <strong>{formatPrice(p.price)}</strong>
                            {p.original_price && <span className="orig">{formatPrice(p.original_price)}</span>}
                          </div>
                        </td>
                        <td>
                          <span className={`stock-indicator ${p.stock > 5 ? 'good' : 'low'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td>{p.warranty_months || 24} Months</td>
                        <td>
                          <span className="avail-text">
                            <MapPin size={12} /> {p.inStoreAvailability || 'Main Showroom'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="row-actions">
                            <button
                              className="btn-icon-table edit"
                              onClick={() => handleOpenProductModal(p)}
                              title="Edit product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn-icon-table delete"
                              onClick={() => handleDeleteProduct(p)}
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="table-empty">
                        No products match your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. ORDERS & CART MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content animate-fadeIn">
            <div className="tab-action-bar">
              <div className="action-search-group">
                <span className="bar-label">Filter by Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer Details</th>
                    <th>Fulfillment Mode</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th style={{ textAlign: 'right' }}>View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => {
                    const ordId = ord._id || ord.order_number;
                    return (
                      <tr key={ordId}>
                        <td>
                          <strong>{ord.order_number}</strong>
                          <span className="table-date">{new Date(ord.created_at).toLocaleDateString()}</span>
                        </td>
                        <td>
                          <div className="table-customer">
                            <strong>{ord.customer_name}</strong>
                            <span>{ord.customer_phone}</span>
                            {ord.customer_email && <span className="sub-em">{ord.customer_email}</span>}
                          </div>
                        </td>
                        <td>
                          {ord.fulfillment_type === 'pickup' ? (
                            <span className="ful-badge pickup">🏪 Store Pickup</span>
                          ) : (
                            <span className="ful-badge delivery">🚚 Doorstep Delivery</span>
                          )}
                        </td>
                        <td>
                          <span className="item-count-chip">
                            {ord.items?.length || 1} Item(s)
                          </span>
                        </td>
                        <td>
                          <strong className="order-total">{formatPrice(ord.total)}</strong>
                        </td>
                        <td>
                          <span className={`status-pill ${ord.status}`}>{ord.status}</span>
                        </td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ordId, e.target.value)}
                            className="status-dropdown"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setOrderDetailsModal(ord)}
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="table-empty">
                        No orders found with status "{orderStatusFilter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. SERVICE REQUESTS & SITE VISITS */}
        {/* ============================================================ */}
        {activeTab === 'services' && (
          <div className="admin-tab-content animate-fadeIn">
            <div className="tab-action-bar">
              <div className="action-search-group">
                <span className="bar-label">Filter by Status:</span>
                <select
                  value={serviceStatusFilter}
                  onChange={(e) => setServiceStatusFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Service Bookings ({serviceRequests.length})</option>
                  <option value="submitted">Submitted</option>
                  <option value="assigned">Technician Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket #</th>
                    <th>Mode</th>
                    <th>Device & Issue</th>
                    <th>Customer & Address</th>
                    <th>Assigned Technician</th>
                    <th>Est. Cost</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((srv) => {
                    const srvId = srv._id || srv.ticket_number;
                    const isSiteVisit = (srv.service_mode || srv.service_type) === 'site_visit';
                    return (
                      <tr key={srvId}>
                        <td>
                          <strong>{srv.ticket_number}</strong>
                          <span className="table-date">{new Date(srv.created_at).toLocaleDateString()}</span>
                        </td>
                        <td>
                          {isSiteVisit ? (
                            <span className="ful-badge delivery">🏠 Site Visit</span>
                          ) : (
                            <span className="ful-badge pickup">🏪 In-Store</span>
                          )}
                          {srv.urgency === 'urgent' && <span className="urg-tag">Urgent</span>}
                        </td>
                        <td>
                          <div className="table-device">
                            <strong>{srv.device_type?.toUpperCase()} - {srv.brand} {srv.model}</strong>
                            <p className="device-issue-text">{srv.issue_description || srv.issue_category}</p>
                          </div>
                        </td>
                        <td>
                          <div className="table-customer">
                            <strong>{srv.customer_name}</strong>
                            <span>{srv.customer_phone}</span>
                            {isSiteVisit && <p className="cust-addr"><MapPin size={11} /> {srv.address}</p>}
                          </div>
                        </td>
                        <td>
                          {srv.assigned_technician ? (
                            <div className="tech-assigned-cell">
                              <span className="tech-name">{srv.assigned_technician}</span>
                              {srv.technician_phone && <span className="tech-phone">{srv.technician_phone}</span>}
                            </div>
                          ) : (
                            <span className="unassigned-text">Unassigned</span>
                          )}
                        </td>
                        <td>{formatPrice(srv.estimated_cost || 499)}</td>
                        <td>
                          <select
                            value={srv.status}
                            onChange={(e) => handleServiceStatusChange(srvId, e.target.value)}
                            className="status-dropdown"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenAssignModal(srv)}
                          >
                            <UserCheck size={14} /> Assign Tech
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="table-empty">
                        No service requests found with status "{serviceStatusFilter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. CUSTOMER INQUIRIES & QUERIES */}
        {/* ============================================================ */}
        {activeTab === 'inquiries' && (
          <div className="admin-tab-content animate-fadeIn">
            <div className="tab-action-bar">
              <div className="action-search-group">
                <span className="bar-label">Filter Status:</span>
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Inquiries ({inquiries.length})</option>
                  <option value="new">New / Unread</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="inquiries-cards-grid">
              {filteredInquiries.map((inq) => {
                const inqId = inq._id;
                return (
                  <div key={inqId} className={`inquiry-admin-card ${inq.status}`}>
                    <div className="inq-top">
                      <div className="inq-sender">
                        <strong>{inq.name}</strong>
                        <span className="inq-date">{new Date(inq.created_at).toLocaleString()}</span>
                      </div>
                      <span className={`status-pill ${inq.status}`}>{inq.status}</span>
                    </div>

                    <div className="inq-contacts">
                      <a href={`tel:${inq.phone}`} className="inq-contact-item">
                        <Phone size={13} /> {inq.phone}
                      </a>
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="inq-contact-item">
                          <Mail size={13} /> {inq.email}
                        </a>
                      )}
                    </div>

                    <div className="inq-subject-pill">
                      Subject: <strong>{inq.subject}</strong>
                    </div>

                    <div className="inq-message-box">
                      <p>{inq.message}</p>
                    </div>

                    {inq.response_note && (
                      <div className="inq-response-note">
                        <strong>Internal Resolution Note:</strong>
                        <p>{inq.response_note}</p>
                      </div>
                    )}

                    <div className="inq-bottom-actions">
                      <span className="status-label">Update Status:</span>
                      <div className="inq-btn-group">
                        <button
                          className={`btn-state-pill ${inq.status === 'new' ? 'active' : ''}`}
                          onClick={() => handleInquiryStatusChange(inqId, 'new')}
                        >
                          New
                        </button>
                        <button
                          className={`btn-state-pill ${inq.status === 'contacted' ? 'active' : ''}`}
                          onClick={() => handleInquiryStatusChange(inqId, 'contacted')}
                        >
                          Contacted
                        </button>
                        <button
                          className={`btn-state-pill ${inq.status === 'resolved' ? 'active' : ''}`}
                          onClick={() => handleInquiryStatusChange(inqId, 'resolved')}
                        >
                          Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredInquiries.length === 0 && (
                <div className="empty-box">
                  <p>No customer inquiries found for filter "{inquiryStatusFilter}".</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ============================================================ */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-container admin-product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProductModalOpen(false)}>
              <X size={20} />
            </button>

            <h2>{editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}</h2>
            <p className="modal-sub">
              Manage product pricing, stock availability, specifications, and warranty coverage.
            </p>

            <form onSubmit={handleProductSubmit} className="admin-product-form">
              <div className="form-row-2">
                <div className="form-field">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HP ProBook 450 G10 Business Laptop"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HP, Dell, Lenovo, Epson, CP PLUS"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label>Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="52990"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="62990"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label>Stock Available</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Warranty (Months)</label>
                  <input
                    type="number"
                    placeholder="24"
                    value={productForm.warranty_months}
                    onChange={(e) => setProductForm({ ...productForm, warranty_months: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Promotional Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller / Hot Deal"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>In-Store Location & Shelf</label>
                <input
                  type="text"
                  placeholder="e.g. Available at Main Store (Aisle B3)"
                  value={productForm.inStoreAvailability}
                  onChange={(e) => setProductForm({ ...productForm, inStoreAvailability: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Description & Features</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive technical details and description..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              {/* Technical Specifications */}
              <div className="spec-inputs-box">
                <h4>Hardware Specifications</h4>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Processor / CPU</label>
                    <input
                      type="text"
                      placeholder="e.g. Intel Core i5 13th Gen"
                      value={productForm.specProcessor}
                      onChange={(e) => setProductForm({ ...productForm, specProcessor: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>RAM / Memory</label>
                    <input
                      type="text"
                      placeholder="e.g. 16GB DDR4 3200MHz"
                      value={productForm.specRAM}
                      onChange={(e) => setProductForm({ ...productForm, specRAM: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Storage</label>
                    <input
                      type="text"
                      placeholder="e.g. 512GB NVMe SSD"
                      value={productForm.specStorage}
                      onChange={(e) => setProductForm({ ...productForm, specStorage: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Display / Screen</label>
                    <input
                      type="text"
                      placeholder="e.g. 15.6 FHD Anti-Glare"
                      value={productForm.specDisplay}
                      onChange={(e) => setProductForm({ ...productForm, specDisplay: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setProductModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ASSIGN TECHNICIAN TO SERVICE / SITE VISIT */}
      {/* ============================================================ */}
      {assignModalOpen && selectedService && (
        <div className="modal-overlay" onClick={() => setAssignModalOpen(false)}>
          <div className="modal-container assign-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAssignModalOpen(false)}>
              <X size={20} />
            </button>

            <h2>Assign Technician to Ticket {selectedService.ticket_number}</h2>
            <p className="modal-sub">
              Allocate a certified hardware specialist for customer: <strong>{selectedService.customer_name}</strong>
            </p>

            <form onSubmit={handleAssignSubmit} className="admin-assign-form">
              <div className="form-field">
                <label>Assigned Engineer Name *</label>
                <input
                  type="text"
                  required
                  value={assignForm.technician_name}
                  onChange={(e) => setAssignForm({ ...assignForm, technician_name: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Technician Phone Number</label>
                <input
                  type="text"
                  value={assignForm.technician_phone}
                  onChange={(e) => setAssignForm({ ...assignForm, technician_phone: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Scheduled Appointment Slot</label>
                  <input
                    type="text"
                    value={assignForm.scheduled_slot}
                    onChange={(e) => setAssignForm({ ...assignForm, scheduled_slot: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Estimated Charge (₹)</label>
                  <input
                    type="number"
                    value={assignForm.estimated_cost}
                    onChange={(e) => setAssignForm({ ...assignForm, estimated_cost: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Technician Dispatch Instructions</label>
                <textarea
                  rows={3}
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Technician Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ORDER DETAILS */}
      {/* ============================================================ */}
      {orderDetailsModal && (
        <div className="modal-overlay" onClick={() => setOrderDetailsModal(null)}>
          <div className="modal-container order-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOrderDetailsModal(null)}>
              <X size={20} />
            </button>

            <h2>Order Invoice & Cart Details</h2>
            <p className="modal-sub">Order Number: <strong>{orderDetailsModal.order_number}</strong></p>

            <div className="ord-modal-summary-box">
              <div className="ord-meta-row">
                <div>
                  <span className="lbl">Customer Name</span>
                  <strong>{orderDetailsModal.customer_name}</strong>
                </div>
                <div>
                  <span className="lbl">Phone</span>
                  <strong>{orderDetailsModal.customer_phone}</strong>
                </div>
                <div>
                  <span className="lbl">Fulfillment Mode</span>
                  <strong>{orderDetailsModal.fulfillment_type === 'pickup' ? '🏪 In-Store Pickup' : '🚚 Doorstep Delivery'}</strong>
                </div>
              </div>

              <div className="ord-meta-row" style={{ marginTop: '0.75rem' }}>
                <div>
                  <span className="lbl">Shipping / Pickup Location</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {orderDetailsModal.shipping_address || 'In-Store Pickup'}
                  </p>
                </div>
                <div>
                  <span className="lbl">Payment Method</span>
                  <strong>{orderDetailsModal.payment_method?.toUpperCase()}</strong>
                </div>
              </div>
            </div>

            <h4>Cart Hardware Items</h4>
            <div className="ord-modal-items">
              {orderDetailsModal.items?.map((it, idx) => (
                <div key={idx} className="ord-item-line">
                  <div>
                    <strong>{it.name || it.product_name}</strong>
                    <span className="ord-warranty-pill">{it.warranty_months || 24}M Warranty</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="qty-tag">x{it.quantity}</span>
                    <strong style={{ marginLeft: '1rem' }}>{formatPrice(it.price * it.quantity)}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="ord-total-strip">
              <span>Total Payable</span>
              <strong className="final-price">{formatPrice(orderDetailsModal.total)}</strong>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setOrderDetailsModal(null)}>
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
