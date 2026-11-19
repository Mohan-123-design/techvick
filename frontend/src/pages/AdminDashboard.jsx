import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Wrench, MessageSquare, Shield,
  Plus, Edit, Trash2, Search, Phone,
  Mail, MapPin, Eye, X, RefreshCw,
  UserCheck, Laptop, Network, Printer, Zap, Database, Cpu, Home,
  Palette, Sliders, CheckCircle2, Check, Sparkles, ArrowRight
} from 'lucide-react';
import { productsApi, ordersApi, servicesApi, usersApi } from '../utils/api';
import { CATEGORIES } from '../constants';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export const SERVICE_CATALOG_CATEGORIES = [
  { id: 'hardware', name: 'Hardware & Chip-Level Repairs', icon: 'Laptop' },
  { id: 'networking', name: 'Networking & Structured Cabling', icon: 'Network' },
  { id: 'cctv_printers', name: 'CCTV Surveillance & Printers', icon: 'Printer' },
  { id: 'upgrades', name: 'High-Speed Hardware Upgrades', icon: 'Zap' },
  { id: 'data_recovery', name: 'Clean-Room Data Recovery', icon: 'Database' },
  { id: 'pc_builds', name: 'Custom Gaming & Workstation PCs', icon: 'Cpu' },
  { id: 'site_visit', name: 'Doorstep Site Visits & AMC', icon: 'Home' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, services_catalog, products, orders, services, inquiries, appearance

  // Theme & Appearance controls from Store Portal
  const {
    theme, isDark, toggleTheme, accent, setAccent,
    density, setDensity, fontFamily, setFontFamily,
    surfaceStyle, setSurfaceStyle, radiusStyle, setRadiusStyle, headerStyle, setHeaderStyle,
    accentPresets, resetAppearance
  } = useTheme();

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [servicesCatalog, setServicesCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCatalogCategory, setServiceCatalogCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = creating new
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(null);

  // Forms
  const [ticketForm, setTicketForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_mode: 'in_store',
    device_type: 'laptop',
    brand: '',
    model: '',
    issue_category: 'general_repair',
    issue_description: '',
    urgency: 'standard',
    address: '',
    preferred_date: '',
    preferred_time_slot: '10:00 AM - 01:00 PM',
    estimated_cost: '',
    status: 'submitted',
    assigned_technician: '',
    technician_phone: '',
    notes: '',
  });
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

  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'hardware',
    badge: 'Specialist Service',
    description: '',
    turnaround: 'Same Day / 24 Hours',
    repair_warranty: 'Written Store Guarantee',
    features: '',
    price: '',
    icon_name: 'Wrench',
    is_active: true,
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
      const [prodRes, ordRes, srvRes, inqRes, catRes] = await Promise.allSettled([
        productsApi.getAll({ limit: 100 }),
        ordersApi.getAllAdmin(),
        servicesApi.getAllAdmin(),
        usersApi.getInquiriesAdmin(),
        servicesApi.getCatalog({ include_inactive: true }),
      ]);

      if (prodRes.status === 'fulfilled') setProducts(prodRes.value?.products || []);
      if (ordRes.status === 'fulfilled') setOrders(ordRes.value?.orders || []);
      if (srvRes.status === 'fulfilled') setServiceRequests(srvRes.value?.service_requests || []);
      if (inqRes.status === 'fulfilled') setInquiries(inqRes.value?.inquiries || []);
      if (catRes.status === 'fulfilled') setServicesCatalog(catRes.value?.services || []);
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
      name: productForm.name.trim(),
      category: productForm.category || 'laptops',
      brand: productForm.brand.trim(),
      price: Number(productForm.price),
      original_price: productForm.original_price ? Number(productForm.original_price) : undefined,
      stock: Number(productForm.stock) || 10,
      warranty_months: Number(productForm.warranty_months) || 24,
      badge: productForm.badge?.trim() || undefined,
      description: productForm.description?.trim() || `Genuine ${productForm.brand} ${productForm.name} available at Techvick Computers Tatabad showroom.`,
      inStoreAvailability: productForm.inStoreAvailability?.trim() || 'Available at Main Store',
      specifications: {
        ...(productForm.specProcessor ? { Processor: productForm.specProcessor.trim() } : {}),
        ...(productForm.specRAM ? { RAM: productForm.specRAM.trim() } : {}),
        ...(productForm.specStorage ? { Storage: productForm.specStorage.trim() } : {}),
        ...(productForm.specDisplay ? { Display: productForm.specDisplay.trim() } : {}),
      },
    };

    try {
      if (editingProduct) {
        const pId = editingProduct._id || editingProduct.id;
        const res = await productsApi.update(pId, payload);
        toast.success(`Updated "${productForm.name}" successfully!`);
        setProducts((prev) =>
          prev.map((p) =>
            String(p._id || p.id) === String(pId)
              ? { ...p, ...payload, ...(res?.product || {}) }
              : p
          )
        );
      } else {
        const res = await productsApi.create(payload);
        toast.success(`Created "${productForm.name}" in catalog!`);
        const createdProd = res?.product || {
          ...payload,
          _id: 'tvc-prod-' + Date.now(),
          id: 'tvc-prod-' + Date.now(),
        };
        setProducts((prev) => [createdProd, ...prev]);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
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
        setProducts((prev) => prev.filter((p) => String(p._id || p.id) !== String(pId)));
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
      setOrders((prev) =>
        prev.map((o) =>
          String(o._id || o.order_number) === String(orderId) ? { ...o, status: newStatus } : o
        )
      );
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
      setServiceRequests((prev) =>
        prev.map((s) =>
          String(s._id || s.ticket_number) === String(requestId)
            ? { ...s, status: newStatus }
            : s
        )
      );
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
      setServiceRequests((prev) =>
        prev.map((s) =>
          String(s._id || s.ticket_number) === String(reqId)
            ? {
                ...s,
                assigned_technician: assignForm.technician_name,
                technician_phone: assignForm.technician_phone,
                estimated_cost: assignForm.estimated_cost,
                preferred_time_slot: assignForm.scheduled_slot,
                status: 'assigned',
              }
            : s
        )
      );
      setAssignModalOpen(false);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to assign technician');
    }
  };

  // ==========================================
  // SERVICE TICKETS CRUD (CREATE / EDIT / DELETE)
  // ==========================================
  const handleOpenTicketModal = (ticket = null) => {
    if (ticket) {
      setEditingTicket(ticket);
      setTicketForm({
        customer_name: ticket.customer_name || '',
        customer_phone: ticket.customer_phone || '',
        customer_email: ticket.customer_email || '',
        service_mode: ticket.service_mode || ticket.service_type || 'in_store',
        device_type: ticket.device_type || 'laptop',
        brand: ticket.brand || '',
        model: ticket.model || '',
        issue_category: ticket.issue_category || 'general_repair',
        issue_description: ticket.issue_description || '',
        urgency: ticket.urgency || 'standard',
        address: ticket.address || '',
        preferred_date: ticket.preferred_date || '',
        preferred_time_slot: ticket.preferred_time_slot || '10:00 AM - 01:00 PM',
        estimated_cost: ticket.estimated_cost !== undefined ? ticket.estimated_cost : 499,
        status: ticket.status || 'submitted',
        assigned_technician: ticket.assigned_technician || '',
        technician_phone: ticket.technician_phone || '',
        notes: Array.isArray(ticket.notes) ? ticket.notes.join('\n') : (ticket.notes || ''),
      });
    } else {
      setEditingTicket(null);
      setTicketForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        service_mode: 'in_store',
        device_type: 'laptop',
        brand: '',
        model: '',
        issue_category: 'general_repair',
        issue_description: '',
        urgency: 'standard',
        address: '',
        preferred_date: '',
        preferred_time_slot: '10:00 AM - 01:00 PM',
        estimated_cost: '',
        status: 'submitted',
        assigned_technician: '',
        technician_phone: '',
        notes: '',
      });
    }
    setTicketModalOpen(true);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.customer_name.trim() || !ticketForm.customer_phone.trim()) {
      toast.error('Customer name and contact phone are required');
      return;
    }

    const payload = {
      customer_name: ticketForm.customer_name.trim(),
      customer_phone: ticketForm.customer_phone.trim(),
      customer_email: ticketForm.customer_email.trim(),
      service_mode: ticketForm.service_mode,
      device_type: ticketForm.device_type,
      brand: ticketForm.brand.trim(),
      model: ticketForm.model.trim(),
      issue_category: ticketForm.issue_category,
      issue_description: ticketForm.issue_description.trim(),
      urgency: ticketForm.urgency,
      address: ticketForm.address.trim(),
      preferred_date: ticketForm.preferred_date || null,
      preferred_time_slot: ticketForm.preferred_time_slot,
      estimated_cost: ticketForm.estimated_cost ? Number(ticketForm.estimated_cost) : 0,
      status: ticketForm.status,
      assigned_technician: ticketForm.assigned_technician.trim() || null,
      technician_phone: ticketForm.technician_phone.trim() || null,
      notes: ticketForm.notes ? ticketForm.notes.split('\n').filter(Boolean) : [],
    };

    try {
      if (editingTicket) {
        const tId = editingTicket._id || editingTicket.ticket_number;
        await servicesApi.updateRequest(tId, payload);
        toast.success(`Service ticket ${editingTicket.ticket_number || ''} updated!`);
        setServiceRequests((prev) =>
          prev.map((t) => (String(t._id || t.ticket_number) === String(tId) ? { ...t, ...payload } : t))
        );
      } else {
        const res = await servicesApi.createAdminRequest(payload);
        const newTicket = res?.service_request || {
          ...payload,
          _id: 'srv-' + Date.now(),
          ticket_number: 'SRV-' + Math.floor(100000 + Math.random() * 900000),
          created_at: new Date().toISOString(),
        };
        toast.success(`Service ticket ${newTicket.ticket_number} created successfully!`);
        setServiceRequests((prev) => [newTicket, ...prev]);
      }
      setTicketModalOpen(false);
      setEditingTicket(null);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Error saving service ticket');
    }
  };

  const handleDeleteTicket = async (ticket) => {
    const tId = ticket._id || ticket.ticket_number;
    const ticketNum = ticket.ticket_number || 'this ticket';
    if (window.confirm(`Are you sure you want to delete service ticket "${ticketNum}" for ${ticket.customer_name}?`)) {
      try {
        await servicesApi.deleteRequest(tId);
        toast.success(`Service ticket ${ticketNum} deleted`);
        setServiceRequests((prev) => prev.filter((t) => String(t._id || t.ticket_number) !== String(tId)));
        loadDashboardData();
      } catch (err) {
        toast.error(err.message || 'Error deleting ticket');
      }
    }
  };

  // ==========================================
  // INQUIRIES HANDLER
  // ==========================================
  const handleInquiryStatusChange = async (inquiryId, newStatus) => {
    try {
      await usersApi.updateInquiryStatus(inquiryId, newStatus);
      toast.success(`Inquiry marked as ${newStatus}`);
      setInquiries((prev) =>
        prev.map((i) =>
          String(i._id || i.id) === String(inquiryId) ? { ...i, status: newStatus } : i
        )
      );
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update inquiry status');
    }
  };

  // ==========================================
  // SERVICE CATALOG CRUD HANDLERS
  // ==========================================
  const renderServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop': return <Laptop size={20} />;
      case 'Network': return <Network size={20} />;
      case 'Printer': return <Printer size={20} />;
      case 'Zap': return <Zap size={20} />;
      case 'Database': return <Database size={20} />;
      case 'Cpu': return <Cpu size={20} />;
      case 'Home': return <Home size={20} />;
      default: return <Wrench size={20} />;
    }
  };

  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        title: service.title || '',
        category: service.category || 'hardware',
        badge: service.badge || '',
        description: service.description || '',
        turnaround: service.turnaround || 'Same Day / 24 Hours',
        repair_warranty: service.repair_warranty || service.repairWarranty || 'Written Store Guarantee',
        features: Array.isArray(service.features) ? service.features.join('\n') : (service.features || ''),
        price: service.price || '',
        icon_name: service.icon_name || 'Wrench',
        is_active: service.is_active !== undefined ? service.is_active : true,
      });
    } else {
      setEditingService(null);
      setServiceForm({
        title: '',
        category: 'hardware',
        badge: 'Specialist Service',
        description: '',
        turnaround: 'Same Day / 24 Hours',
        repair_warranty: 'Written Store Guarantee',
        features: '',
        price: '',
        icon_name: 'Wrench',
        is_active: true,
      });
    }
    setServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) {
      toast.error('Service Title is required');
      return;
    }

    const featuresArray = serviceForm.features
      ? serviceForm.features.split('\n').map((f) => f.trim()).filter(Boolean)
      : [];

    const payload = {
      title: serviceForm.title.trim(),
      category: serviceForm.category || 'hardware',
      badge: serviceForm.badge?.trim() || 'Specialist Service',
      description: serviceForm.description?.trim() || '',
      turnaround: serviceForm.turnaround?.trim() || 'Same Day / 24 Hours',
      repair_warranty: serviceForm.repair_warranty?.trim() || 'Written Store Guarantee',
      features: featuresArray,
      price: serviceForm.price?.trim() || '',
      icon_name: serviceForm.icon_name || 'Wrench',
      is_active: serviceForm.is_active,
    };

    try {
      if (editingService) {
        const sId = editingService._id || editingService.id;
        const res = await servicesApi.updateCatalogItem(sId, payload);
        toast.success(`Updated service "${payload.title}" successfully!`);
        setServicesCatalog((prev) =>
          prev.map((s) => (String(s._id || s.id) === String(sId) ? { ...s, ...payload, ...(res?.service || {}) } : s))
        );
      } else {
        const res = await servicesApi.createCatalogItem(payload);
        toast.success(`Created service "${payload.title}" in catalog!`);
        const createdSvc = res?.service || {
          ...payload,
          _id: 'tvc-srv-' + Date.now(),
          id: 'tvc-srv-' + Date.now(),
        };
        setServicesCatalog((prev) => [createdSvc, ...prev]);
      }
      setServiceModalOpen(false);
      setEditingService(null);
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Error saving service');
    }
  };

  const handleDeleteService = async (service) => {
    const sId = service._id || service.id;
    if (window.confirm(`Are you sure you want to delete service "${service.title}"?`)) {
      try {
        await servicesApi.deleteCatalogItem(sId);
        toast.success(`Deleted service "${service.title}"`);
        setServicesCatalog((prev) => prev.filter((s) => String(s._id || s.id) !== String(sId)));
        loadDashboardData();
      } catch (err) {
        toast.error(err.message || 'Error deleting service');
      }
    }
  };

  const handleToggleServiceStatus = async (service) => {
    const sId = service._id || service.id;
    const nextState = !service.is_active;
    try {
      await servicesApi.updateCatalogItem(sId, { is_active: nextState });
      toast.success(`Service marked as ${nextState ? 'Active' : 'Inactive'}`);
      setServicesCatalog((prev) =>
        prev.map((s) => (String(s._id || s.id) === String(sId) ? { ...s, is_active: nextState } : s))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update service status');
    }
  };

  // Filtered Lists
  const filteredCatalogServices = servicesCatalog.filter((s) => {
    const matchCat =
      serviceCatalogCategory === 'all' ||
      s.category?.toLowerCase() === serviceCatalogCategory.toLowerCase();
    const matchSearch =
      !serviceSearch ||
      (s.title || '').toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCat && matchSearch;
  });
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
    const matchStatus = serviceStatusFilter === 'all' || s.status === serviceStatusFilter;
    if (!ticketSearch) return matchStatus;
    const q = ticketSearch.toLowerCase();
    const matchSearch =
      (s.ticket_number || '').toLowerCase().includes(q) ||
      (s.customer_name || '').toLowerCase().includes(q) ||
      (s.customer_phone || '').toLowerCase().includes(q) ||
      (s.brand || '').toLowerCase().includes(q) ||
      (s.model || '').toLowerCase().includes(q) ||
      (s.device_type || '').toLowerCase().includes(q) ||
      (s.issue_description || '').toLowerCase().includes(q) ||
      (s.address || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
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
          <div className="admin-header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className={`btn btn-sm ${activeTab === 'appearance' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('appearance')}
              title="Customize theme, accent color, font & density"
            >
              <Palette size={15} />
              <span>UI & Branding</span>
            </button>
            <button className="btn btn-secondary btn-sm refresh-btn" onClick={loadDashboardData} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Sync Data</span>
            </button>
          </div>
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
            className={`admin-tab ${activeTab === 'services_catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('services_catalog')}
          >
            <Wrench size={18} />
            <span>Services Catalog ({servicesCatalog.length})</span>
            <span className="tab-pill blue">Focus</span>
          </button>

          <button
            className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Laptop size={18} />
            <span>Service Tickets ({serviceRequests.length})</span>
            {activeServiceVisits > 0 && <span className="tab-pill blue">{activeServiceVisits}</span>}
          </button>

          <button
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products ({products.length})</span>
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
            className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <MessageSquare size={18} />
            <span>User Queries ({inquiries.length})</span>
            {newInquiriesCount > 0 && <span className="tab-pill amber">{newInquiriesCount}</span>}
          </button>

          <button
            className={`admin-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} />
            <span>UI & Branding</span>
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
                  <button className="quick-act-btn" onClick={() => { setActiveTab('services_catalog'); handleOpenServiceModal(); }}>
                    <Wrench size={18} />
                    <div>
                      <strong>Add Service Offering</strong>
                      <span>Create chip-level, LAN or CCTV service</span>
                    </div>
                  </button>

                  <button className="quick-act-btn" onClick={() => setActiveTab('appearance')}>
                    <Palette size={18} />
                    <div>
                      <strong>Customize UI & Branding</strong>
                      <span>Theme colors, typography & layout density</span>
                    </div>
                  </button>

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
        {/* 4. SERVICE REQUESTS & SITE VISITS (FULL ADMIN CRUD) */}
        {/* ============================================================ */}
        {activeTab === 'services' && (
          <div className="admin-tab-content animate-fadeIn">
            <div className="tab-action-bar">
              <div className="action-search-group">
                <div className="search-input-wrap">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search ticket #, customer, phone, brand..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="admin-search-input"
                  />
                  {ticketSearch && (
                    <button className="clear-search-btn" onClick={() => setTicketSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <span className="bar-label">Status:</span>
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

              <button className="btn btn-primary" onClick={() => handleOpenTicketModal()}>
                <Plus size={16} /> Create Service Ticket
              </button>
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
                        <td>{srv.estimated_cost ? formatPrice(srv.estimated_cost) : <span style={{ color: 'var(--text-secondary)' }}>Diagnostic</span>}</td>
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
                          <div className="table-actions">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenAssignModal(srv)}
                              title="Assign field or bench technician"
                            >
                              <UserCheck size={14} /> Assign
                            </button>
                            <button
                              className="btn-icon-table edit"
                              onClick={() => handleOpenTicketModal(srv)}
                              title="Edit Service Ticket Details"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              className="btn-icon-table delete"
                              onClick={() => handleDeleteTicket(srv)}
                              title="Delete Service Ticket"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="table-empty">
                        No service requests found matching your filter or search criteria.
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
                const inqId = inq._id || inq.id;
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

        {/* ============================================================ */}
        {/* 6. SERVICES CATALOG (FULL CRUD - 200% FOCUS) */}
        {/* ============================================================ */}
        {activeTab === 'services_catalog' && (
          <div className="admin-tab-content animate-fadeIn">
            {/* Strategy Notice Banner */}
            <div className="service-strategy-banner">
              <div className="strategy-icon-box">
                <Sparkles size={22} />
              </div>
              <div className="strategy-content">
                <strong>Services-First Operations Mode</strong>
                <p>
                  Per store policy, fixed pricing is unmentioned / left blank so walk-in customers and callers receive free counter diagnostics and custom quotes upon physical inspection.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="tab-action-bar">
              <div className="action-search-group">
                <div className="admin-search-wrap">
                  <Search size={16} className="as-icon" />
                  <input
                    type="text"
                    placeholder="Search services by title, issue, or keyword..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                  {serviceSearch && <button onClick={() => setServiceSearch('')}><X size={14} /></button>}
                </div>

                <select
                  value={serviceCatalogCategory}
                  onChange={(e) => setServiceCatalogCategory(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Service Sectors</option>
                  {SERVICE_CATALOG_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary" onClick={() => handleOpenServiceModal()}>
                <Plus size={16} /> Add New Service
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="catalog-cat-chips">
              <button
                className={`cat-chip-btn ${serviceCatalogCategory === 'all' ? 'active' : ''}`}
                onClick={() => setServiceCatalogCategory('all')}
              >
                All Sectors ({servicesCatalog.length})
              </button>
              {SERVICE_CATALOG_CATEGORIES.map((cat) => {
                const count = servicesCatalog.filter(
                  (s) => s.category?.toLowerCase() === cat.id.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat.id}
                    className={`cat-chip-btn ${serviceCatalogCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setServiceCatalogCategory(cat.id)}
                  >
                    {renderServiceIcon(cat.icon)}
                    <span>{cat.name}</span>
                    <span className="count-pill">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Services Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service Offering</th>
                    <th>Category</th>
                    <th>Badge</th>
                    <th>Turnaround</th>
                    <th>Warranty</th>
                    <th>Features</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogServices.map((svc) => {
                    const sId = svc._id || svc.id;
                    const featuresList = Array.isArray(svc.features)
                      ? svc.features
                      : svc.features ? svc.features.split('\n') : [];
                    return (
                      <tr key={sId} className={svc.is_active === false ? 'row-inactive' : ''}>
                        <td>
                          <div className="service-title-cell">
                            <div className="svc-icon-badge">
                              {renderServiceIcon(svc.icon_name)}
                            </div>
                            <div>
                              <strong>{svc.title}</strong>
                              <p className="svc-desc-snippet">{svc.description}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="cat-chip">{svc.category?.toUpperCase()}</span>
                        </td>
                        <td>
                          {svc.badge ? <span className="prod-badge-tag">{svc.badge}</span> : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <span className="spec-val">{svc.turnaround || 'Same Day'}</span>
                        </td>
                        <td>
                          <span className="spec-val">{svc.repair_warranty || svc.repairWarranty || 'Written Guarantee'}</span>
                        </td>
                        <td>
                          <span className="feature-count-badge">
                            {featuresList.length} items
                          </span>
                        </td>
                        <td>
                          <button
                            className={`status-toggle-btn ${svc.is_active !== false ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleServiceStatus(svc)}
                            title="Click to toggle Active/Inactive"
                          >
                            <span className="dot"></span>
                            {svc.is_active !== false ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="row-actions">
                            <button
                              className="action-icon-btn edit"
                              onClick={() => handleOpenServiceModal(svc)}
                              title="Edit Service"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              className="action-icon-btn delete"
                              onClick={() => handleDeleteService(svc)}
                              title="Delete Service"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredCatalogServices.length === 0 && (
                <div className="empty-box">
                  <p>No service offerings found matching "{serviceSearch || serviceCatalogCategory}".</p>
                  <button className="btn btn-primary btn-sm" onClick={() => handleOpenServiceModal()}>
                    <Plus size={14} /> Create New Service Offering
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. UI & BRANDING CUSTOMIZER (AXORA-INSPIRED) */}
        {/* ============================================================ */}
        {activeTab === 'appearance' && (
          <div className="admin-tab-content animate-fadeIn appearance-tab-content">
            <div className="appearance-header-card">
              <div className="app-header-left">
                <h2>
                  <Palette size={22} className="accent-text" /> Storefront Branding & UI Appearance
                </h2>
                <p>
                  Live real-time customizer inspired by modern dark-slate SaaS design tokens (Axora). Changes apply instantly across the storefront, cards, badges, and admin dashboard.
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  resetAppearance();
                  toast.success('Reset appearance settings to default Techvick styling!', { id: 'reset-toast' });
                }}
              >
                <RefreshCw size={14} /> Reset Defaults
              </button>
            </div>

            <div className="appearance-grid">
              {/* Color Mode / Theme */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <Sliders size={18} />
                  <h3>Color Mode</h3>
                </div>
                <p className="app-card-sub">Choose between Axora slate-navy dark mode or clean high-contrast light mode.</p>
                <div className="theme-toggle-row">
                  <button
                    className={`theme-mode-btn ${isDark ? 'active' : ''}`}
                    onClick={() => {
                      if (theme !== 'dark') {
                        toggleTheme();
                        toast.success('Switched to Dark Slate-Navy Mode!', { id: 'mode-toast' });
                      }
                    }}
                  >
                    <span className="mode-indicator dark"></span>
                    <div>
                      <strong>Dark Slate-Navy</strong>
                      <span>Axora #0b1020 • High-tech glassmorphism</span>
                    </div>
                  </button>
                  <button
                    className={`theme-mode-btn ${!isDark ? 'active' : ''}`}
                    onClick={() => {
                      if (theme !== 'light') {
                        toggleTheme();
                        toast.success('Switched to Clean Light Mode!', { id: 'mode-toast' });
                      }
                    }}
                  >
                    <span className="mode-indicator light"></span>
                    <div>
                      <strong>Clean Light</strong>
                      <span>Bright daylight mode • Crisp typography</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Accent Color Presets */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <Sparkles size={18} />
                  <h3>Brand Accent Palette</h3>
                </div>
                <p className="app-card-sub">Select the primary accent color used for buttons, active tabs, glowing borders, and focus rings.</p>
                <div className="color-presets-grid">
                  {Object.entries(accentPresets).map(([key, preset]) => {
                    const isSelected = accent === key;
                    return (
                      <button
                        key={key}
                        className={`color-preset-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setAccent(key);
                          toast.success(`Accent color switched to ${preset.name}!`, { id: 'theme-toast' });
                        }}
                      >
                        <div className="preset-swatch" style={{ background: preset.primary }}>
                          {isSelected && <Check size={16} className="preset-check" />}
                        </div>
                        <div className="preset-info">
                          <strong>{preset.name}</strong>
                          <span className="preset-hex">{preset.primary}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography Font Stack */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <Laptop size={18} />
                  <h3>Storefront Typography</h3>
                </div>
                <p className="app-card-sub">Select the display and body font stack for the entire application.</p>
                <div className="font-presets-grid">
                  {[
                    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', note: 'Axora Modern Sans' },
                    { id: 'DM Sans', label: 'DM Sans', note: 'Clean Editorial Sans' },
                    { id: 'Outfit', label: 'Outfit', note: 'Techvick Tech Brand' },
                    { id: 'Inter', label: 'Inter', note: 'High Legibility Standard' },
                    { id: 'Sora', label: 'Sora', note: 'Futuristic Display' },
                  ].map((f) => {
                    const isSelected = fontFamily === f.id;
                    return (
                      <button
                        key={f.id}
                        className={`font-preset-card ${isSelected ? 'selected' : ''}`}
                        style={{ fontFamily: f.id }}
                        onClick={() => {
                          setFontFamily(f.id);
                          toast.success(`Font family switched to ${f.label}!`, { id: 'font-toast' });
                        }}
                      >
                        <div className="font-header">
                          <strong style={{ fontFamily: f.id }}>{f.label}</strong>
                          {isSelected && <Check size={15} className="accent-text" />}
                        </div>
                        <span className="font-sample">Aa Bb Cc 1 2 3 • {f.note}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Density */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <Sliders size={18} />
                  <h3>Layout Density</h3>
                </div>
                <p className="app-card-sub">Control spacing and padding across cards, tables, and dashboards.</p>
                <div className="density-toggle-group">
                  <button
                    className={`density-btn ${density === 'comfortable' ? 'active' : ''}`}
                    onClick={() => {
                      setDensity('comfortable');
                      toast.success('Layout density set to Comfortable (Standard)!', { id: 'density-toast' });
                    }}
                  >
                    <strong>Comfortable</strong>
                    <span>Standard spacious padding • Recommended for storefront</span>
                  </button>
                  <button
                    className={`density-btn ${density === 'compact' ? 'active' : ''}`}
                    onClick={() => {
                      setDensity('compact');
                      toast.success('Layout density set to Compact (Condensed Data)!', { id: 'density-toast' });
                    }}
                  >
                    <strong>Compact</strong>
                    <span>Condensed data view • Recommended for high-volume store counter</span>
                  </button>
                </div>
              </div>

              {/* Card Surface Texture */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <Sparkles size={18} />
                  <h3>Card Surface Texture</h3>
                </div>
                <p className="app-card-sub">Choose between frosted Axora glass, solid opaque cards, or glowing neon borders.</p>
                <div className="density-toggle-group">
                  <button
                    className={`density-btn ${surfaceStyle === 'glass' ? 'active' : ''}`}
                    onClick={() => {
                      setSurfaceStyle('glass');
                      toast.success('Surface set to Axora Frosted Glass!', { id: 'surface-toast' });
                    }}
                  >
                    <strong>Frosted Glass</strong>
                    <span>Translucent slate with backdrop blur</span>
                  </button>
                  <button
                    className={`density-btn ${surfaceStyle === 'solid' ? 'active' : ''}`}
                    onClick={() => {
                      setSurfaceStyle('solid');
                      toast.success('Surface set to Solid Clean Opaque!', { id: 'surface-toast' });
                    }}
                  >
                    <strong>Solid Clean</strong>
                    <span>Opaque surfaces with zero blur & maximum contrast</span>
                  </button>
                  <button
                    className={`density-btn ${surfaceStyle === 'glow' ? 'active' : ''}`}
                    onClick={() => {
                      setSurfaceStyle('glow');
                      toast.success('Surface set to Cyber Neon Glow!', { id: 'surface-toast' });
                    }}
                  >
                    <strong>Neon Glow</strong>
                    <span>Vibrant accent-colored outer card glows</span>
                  </button>
                </div>
              </div>

              {/* Corner Radius Styling */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <Sliders size={18} />
                  <h3>Corner Geometry & Radius</h3>
                </div>
                <p className="app-card-sub">Control curvature of cards, buttons, badges, and modals across the application.</p>
                <div className="density-toggle-group">
                  <button
                    className={`density-btn ${radiusStyle === 'rounded' ? 'active' : ''}`}
                    onClick={() => {
                      setRadiusStyle('rounded');
                      toast.success('Corner radius set to Modern Balanced (Rounded)!', { id: 'radius-toast' });
                    }}
                  >
                    <strong>Modern Rounded</strong>
                    <span>12px - 16px standard balanced curves</span>
                  </button>
                  <button
                    className={`density-btn ${radiusStyle === 'curved' ? 'active' : ''}`}
                    onClick={() => {
                      setRadiusStyle('curved');
                      toast.success('Corner radius set to Curved Pill!', { id: 'radius-toast' });
                    }}
                  >
                    <strong>Curved Pill</strong>
                    <span>20px - 28px smooth organic curves</span>
                  </button>
                  <button
                    className={`density-btn ${radiusStyle === 'sharp' ? 'active' : ''}`}
                    onClick={() => {
                      setRadiusStyle('sharp');
                      toast.success('Corner radius set to Sharp Tech!', { id: 'radius-toast' });
                    }}
                  >
                    <strong>Sharp Tech</strong>
                    <span>4px - 6px precision technical corners</span>
                  </button>
                </div>
              </div>

              {/* Header / Navbar Styling */}
              <div className="appearance-card">
                <div className="app-card-title">
                  <LayoutDashboard size={18} />
                  <h3>Storefront Header Style</h3>
                </div>
                <p className="app-card-sub">Adjust the visual presentation of the main storefront navigation bar.</p>
                <div className="density-toggle-group">
                  <button
                    className={`density-btn ${headerStyle === 'frosted' ? 'active' : ''}`}
                    onClick={() => {
                      setHeaderStyle('frosted');
                      toast.success('Header set to Frosted Blur Floating!', { id: 'header-toast' });
                    }}
                  >
                    <strong>Frosted Blur</strong>
                    <span>Modern floating blur backdrop</span>
                  </button>
                  <button
                    className={`density-btn ${headerStyle === 'solid' ? 'active' : ''}`}
                    onClick={() => {
                      setHeaderStyle('solid');
                      toast.success('Header set to Solid High-Contrast!', { id: 'header-toast' });
                    }}
                  >
                    <strong>Solid Clean</strong>
                    <span>Opaque background matching page foundation</span>
                  </button>
                  <button
                    className={`density-btn ${headerStyle === 'bordered' ? 'active' : ''}`}
                    onClick={() => {
                      setHeaderStyle('bordered');
                      toast.success('Header set to Accent Underline Border!', { id: 'header-toast' });
                    }}
                  >
                    <strong>Accent Border</strong>
                    <span>Vibrant colored border along bottom</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div className="live-preview-section">
              <h3>Live Component Preview</h3>
              <p className="text-muted">Real-time rendering of your active theme, accent palette, and typography:</p>
              <div className="live-preview-card">
                <div className="preview-top-row">
                  <div className="preview-badge-row">
                    <span className="preview-pill">Specialist Service</span>
                    <span className="preview-status-pill">Active in Store</span>
                  </div>
                  <span className="preview-category">CHIP-LEVEL HARDWARE</span>
                </div>
                <h3 className="preview-title">MacBook Pro M-Series Motherboard Diagnostics & Liquid Clean</h3>
                <p className="preview-desc">
                  State-of-the-art ultrasonic cleansing and component-level micro-soldering for corroded traces, charging ICs, and backlight circuits at Techvick Tatabad showroom.
                </p>
                <div className="preview-checklist">
                  <div className="preview-item"><CheckCircle2 size={16} /> Free Counter Assessment</div>
                  <div className="preview-item"><CheckCircle2 size={16} /> Written Store Warranty</div>
                  <div className="preview-item"><CheckCircle2 size={16} /> Genuine OEM Spares</div>
                </div>
                <div className="preview-action-row">
                  <button className="btn btn-primary">
                    Book Service Now <ArrowRight size={16} />
                  </button>
                  <button className="btn btn-secondary">
                    WhatsApp Technician
                  </button>
                </div>
              </div>
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

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT SERVICE OFFERING */}
      {/* ============================================================ */}
      {serviceModalOpen && (
        <div className="modal-overlay" onClick={() => setServiceModalOpen(false)}>
          <div className="modal-container admin-service-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setServiceModalOpen(false)}>
              <X size={20} />
            </button>

            <h2>{editingService ? 'Edit Service Offering' : 'Add New Service Offering'}</h2>
            <p className="modal-sub">
              Manage service capabilities, repair turnaround, written warranty guarantees, and features.
            </p>

            <form onSubmit={handleServiceSubmit} className="admin-service-form">
              <div className="form-row-2">
                <div className="form-field">
                  <label>Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MacBook & Gaming Laptop Motherboard Repair"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Service Sector / Category *</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  >
                    {SERVICE_CATALOG_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Promotional Badge / Highlight</label>
                  <input
                    type="text"
                    placeholder="e.g. Specialist Service, Express 45-Mins, Coimbatore Wide"
                    value={serviceForm.badge}
                    onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Representative Icon</label>
                  <select
                    value={serviceForm.icon_name}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon_name: e.target.value })}
                  >
                    <option value="Laptop">Laptop / Computer</option>
                    <option value="Network">Networking / LAN</option>
                    <option value="Printer">Printer / CCTV</option>
                    <option value="Zap">Zap / High-Speed Upgrade</option>
                    <option value="Database">Database / Data Recovery</option>
                    <option value="Cpu">CPU / Custom PC Build</option>
                    <option value="Home">Home / Doorstep Site Visit</option>
                    <option value="Wrench">Wrench / General Tool</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Turnaround Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Same Day / 24 Hours, 30-45 Minutes"
                    value={serviceForm.turnaround}
                    onChange={(e) => setServiceForm({ ...serviceForm, turnaround: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Written Warranty Coverage</label>
                  <input
                    type="text"
                    placeholder="e.g. Written Store Guarantee, Up to 1-Year Guarantee"
                    value={serviceForm.repair_warranty}
                    onChange={(e) => setServiceForm({ ...serviceForm, repair_warranty: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Pricing / Amount (Optional - Blank per Service Strategy)</label>
                <input
                  type="text"
                  placeholder="Leave empty / blank for 'Quote upon Diagnosis'"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                />
                <small className="form-hint" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  Recommendation: Keep blank. Store policy provides free counter assessment and custom quotation upon physical examination.
                </small>
              </div>

              <div className="form-field">
                <label>Service Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the diagnostics, repair procedure, or equipment serviced..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Features & Checklist (One feature per line)</label>
                <textarea
                  rows={4}
                  placeholder="Free on-the-spot counter assessment&#10;Motherboard & chip-level micro-soldering&#10;Genuine brand replacement components&#10;Clean-room testing & thermal burn-in"
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                />
              </div>

              <div className="form-field checkbox-field" style={{ margin: '0.5rem 0' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={serviceForm.is_active}
                    onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                  />
                  <span>Active & Visible on Customer Services Page</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setServiceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Save Changes' : 'Create Service Offering'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CREATE / EDIT SERVICE TICKET MODAL */}
      {/* ============================================================ */}
      {ticketModalOpen && (
        <div className="modal-overlay" onClick={() => setTicketModalOpen(false)}>
          <div className="modal-container admin-ticket-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTicketModalOpen(false)}>
              <X size={20} />
            </button>

            <h2>{editingTicket ? `Edit Ticket ${editingTicket.ticket_number}` : 'Create New Service Ticket'}</h2>
            <p className="modal-sub">
              Direct counter intake, doorstep site visit dispatch, diagnostics logging & technician assignment.
            </p>

            <form onSubmit={handleTicketSubmit} className="admin-modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={ticketForm.customer_name}
                    onChange={(e) => setTicketForm({ ...ticketForm, customer_name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 8807023322"
                    value={ticketForm.customer_phone}
                    onChange={(e) => setTicketForm({ ...ticketForm, customer_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Customer Email</label>
                  <input
                    type="email"
                    placeholder="customer@gmail.com (optional)"
                    value={ticketForm.customer_email}
                    onChange={(e) => setTicketForm({ ...ticketForm, customer_email: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Service Mode *</label>
                  <select
                    value={ticketForm.service_mode}
                    onChange={(e) => setTicketForm({ ...ticketForm, service_mode: e.target.value })}
                  >
                    <option value="in_store">🏪 Walk-In to Tatabad Store</option>
                    <option value="site_visit">🏠 Doorstep Site Visit (Coimbatore)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Device Type *</label>
                  <select
                    value={ticketForm.device_type}
                    onChange={(e) => setTicketForm({ ...ticketForm, device_type: e.target.value })}
                  >
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop PC / Workstation</option>
                    <option value="imac">Apple iMac / Mac Mini</option>
                    <option value="printer">Printer (Laser / InkTank)</option>
                    <option value="cctv">CCTV Surveillance & DVR</option>
                    <option value="networking">Networking & Wi-Fi Switch</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Brand & Model</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Brand (e.g. Dell, HP, Lenovo)"
                      value={ticketForm.brand}
                      onChange={(e) => setTicketForm({ ...ticketForm, brand: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Model (e.g. ThinkPad T480)"
                      value={ticketForm.model}
                      onChange={(e) => setTicketForm({ ...ticketForm, model: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Issue Category</label>
                  <select
                    value={ticketForm.issue_category}
                    onChange={(e) => setTicketForm({ ...ticketForm, issue_category: e.target.value })}
                  >
                    <option value="general_repair">General Diagnostic & Repair</option>
                    <option value="screen_display">Display / Screen Damage</option>
                    <option value="battery_power">Power Supply & Battery</option>
                    <option value="motherboard_chip">Motherboard & Chip-Level Micro-Soldering</option>
                    <option value="slow_upgrade">High-Speed SSD & RAM Upgrade</option>
                    <option value="os_software">OS Clean Install & Driver Config</option>
                    <option value="printer_repair">Printer Toner / Paper Jam / Roller</option>
                    <option value="cctv_network">CCTV Online DVR / Cabling Setup</option>
                    <option value="data_recovery">Clean-Room Hard Drive Data Recovery</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Urgency Level</label>
                  <select
                    value={ticketForm.urgency}
                    onChange={(e) => setTicketForm({ ...ticketForm, urgency: e.target.value })}
                  >
                    <option value="standard">Standard Priority</option>
                    <option value="urgent">⚡ Urgent (Express Turnaround)</option>
                  </select>
                </div>
              </div>

              {ticketForm.service_mode === 'site_visit' && (
                <div className="form-field">
                  <label>Doorstep Service / Pickup Address *</label>
                  <input
                    type="text"
                    required={ticketForm.service_mode === 'site_visit'}
                    placeholder="Enter full address & nearby landmark in Coimbatore..."
                    value={ticketForm.address}
                    onChange={(e) => setTicketForm({ ...ticketForm, address: e.target.value })}
                  />
                </div>
              )}

              <div className="form-field">
                <label>Issue Description & Symptoms</label>
                <textarea
                  rows={3}
                  placeholder="Detailed customer complaints, diagnostic observations, physical condition..."
                  value={ticketForm.issue_description}
                  onChange={(e) => setTicketForm({ ...ticketForm, issue_description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Estimated Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="0 = Quote upon Diagnosis"
                    value={ticketForm.estimated_cost}
                    onChange={(e) => setTicketForm({ ...ticketForm, estimated_cost: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Ticket Status</label>
                  <select
                    value={ticketForm.status}
                    onChange={(e) => setTicketForm({ ...ticketForm, status: e.target.value })}
                  >
                    <option value="submitted">Submitted (Awaiting Review)</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="assigned">Technician Assigned</option>
                    <option value="in_progress">In Progress / Bench Testing</option>
                    <option value="completed">Completed & Ready for Delivery</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Assigned Technician</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar (Senior Hardware Engineer)"
                    value={ticketForm.assigned_technician}
                    onChange={(e) => setTicketForm({ ...ticketForm, assigned_technician: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Technician Phone</label>
                  <input
                    type="tel"
                    placeholder="8807023322"
                    value={ticketForm.technician_phone}
                    onChange={(e) => setTicketForm({ ...ticketForm, technician_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Internal Store Notes (One note per line)</label>
                <textarea
                  rows={2}
                  placeholder="Spare components ordered, customer notified via WhatsApp, etc."
                  value={ticketForm.notes}
                  onChange={(e) => setTicketForm({ ...ticketForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setTicketModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTicket ? 'Update Service Ticket' : 'Create Service Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
