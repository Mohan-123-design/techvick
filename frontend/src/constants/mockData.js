import { REAL_MARKET_PRODUCTS } from '../utils/realMarketProducts';

// Techvick Real Products & Fallback Store Data
export const MOCK_PRODUCTS = REAL_MARKET_PRODUCTS;

export const MOCK_WARRANTIES = {
  'TVC-LAP-2024-001': {
    serialNumber: 'TVC-LAP-2024-001',
    customerName: 'Karthik Subramanian',
    customerPhone: '+91 94433 11223',
    productName: 'Lenovo ThinkPad E14 Gen 5 AMD Ryzen 7',
    category: 'Laptops',
    purchaseDate: '2024-02-15',
    expiryDate: '2027-02-15',
    status: 'Active',
    coverage: '3-Year Comprehensive Store & On-Site Warranty',
    storeLocation: 'Techvick Computers - Tatabad Main Store',
    invoiceNumber: 'INV-TVC-2024-0104',
    remainingDays: 835
  },
  'TVC-PRN-2024-089': {
    serialNumber: 'TVC-PRN-2024-089',
    customerName: 'Meenakshi Sundaram',
    customerPhone: '+91 98401 77654',
    productName: 'Epson EcoTank L3210 All-in-One Ink Tank Printer',
    category: 'Printers',
    purchaseDate: '2024-04-10',
    expiryDate: '2025-04-10',
    status: 'Active',
    coverage: 'Print Head & Logic Board Warranty',
    storeLocation: 'Techvick Computers - Tatabad Main Store',
    invoiceNumber: 'INV-TVC-2024-0489',
    remainingDays: 160
  },
  'TVC-CAM-2024-112': {
    serialNumber: 'TVC-CAM-2024-112',
    customerName: 'Tatabad Academy',
    customerPhone: '+91 94440 22334',
    productName: 'CP PLUS 4-Channel 2.4MP Full HD CCTV Surveillance Kit',
    category: 'CCTV & Cameras',
    purchaseDate: '2024-01-20',
    expiryDate: '2026-01-20',
    status: 'Active',
    coverage: '2-Year Full Hardware Replacement & Site Support',
    storeLocation: 'Techvick Computers - Tatabad Main Store',
    invoiceNumber: 'INV-TVC-2024-1102',
    remainingDays: 445
  },
  'TVC-EXP-2022-999': {
    serialNumber: 'TVC-EXP-2022-999',
    customerName: 'Divya Bharathi',
    customerPhone: '+91 97890 55443',
    productName: 'Dell Latitude 3420 Laptop',
    category: 'Laptops',
    purchaseDate: '2022-03-01',
    expiryDate: '2023-03-01',
    status: 'Expired',
    coverage: 'Standard 1-Year Limited Warranty (Renewable under Techvick AMC)',
    storeLocation: 'Techvick Computers - Tatabad Main Store',
    invoiceNumber: 'INV-TVC-2022-2201',
    remainingDays: 0
  }
};

export const MOCK_ORDERS = [
  {
    _id: 'ord-101',
    order_number: 'TVC-2026-X89A12',
    customer_name: 'Anand Kumar',
    customer_phone: '+91 98765 44321',
    customer_email: 'anand.k@example.com',
    fulfillment_type: 'pickup',
    shipping_address: 'In-Store Pickup (46, 8th Street, Tatabad Showroom)',
    status: 'confirmed',
    payment_method: 'counter_cod',
    total: 49990,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    items: [
      {
        product_id: 'tvc-lap-01',
        name: 'HP 15s 12th Gen Intel Core i5 Laptop',
        price: 49990,
        quantity: 1,
        warranty_months: 24
      }
    ]
  },
  {
    _id: 'ord-102',
    order_number: 'TVC-2026-Z77B90',
    customer_name: 'Dr. S. Meenakshi',
    customer_phone: '+91 98402 11982',
    customer_email: 'clinic.meenakshi@gmail.com',
    fulfillment_type: 'delivery',
    shipping_address: 'Flat 4B, Emerald Heights, RS Puram, Coimbatore',
    status: 'processing',
    payment_method: 'upi',
    total: 21480,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      {
        product_id: 'tvc-prt-01',
        name: 'Epson EcoTank L3210 All-in-One Ink Tank Printer',
        price: 11990,
        quantity: 1,
        warranty_months: 12
      },
      {
        product_id: 'tvc-cctv-01',
        name: 'CP PLUS 4-Channel 2.4MP Full HD CCTV Surveillance Kit',
        price: 9490,
        quantity: 1,
        warranty_months: 24
      }
    ]
  }
];

export const MOCK_SERVICE_REQUESTS = [
  {
    _id: 'srv-001',
    ticket_number: 'SRV-882190',
    service_mode: 'site_visit',
    device_type: 'desktop',
    brand: 'Dell',
    model: 'OptiPlex Desktop',
    issue_category: 'slow_upgrade',
    issue_description: 'Need Samsung 1TB NVMe SSD upgrade and RAM expansion to 16GB. System is slow.',
    urgency: 'urgent',
    customer_name: 'Vikram Seth',
    customer_phone: '+91 97890 12345',
    customer_email: 'vikram.seth@live.com',
    address: 'Plot 42, Ram Nagar, Gandhipuram',
    landmark: 'Near 100 Feet Road',
    preferred_date: '2026-11-01',
    preferred_time_slot: '10:00 AM - 01:00 PM',
    status: 'assigned',
    assigned_technician: 'Ramesh Kumar (Senior Hardware Engineer)',
    technician_phone: '+91 94433 87654',
    estimated_cost: 699,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    _id: 'srv-002',
    ticket_number: 'SRV-882191',
    service_mode: 'in_store',
    device_type: 'laptop',
    brand: 'Lenovo',
    model: 'ThinkPad T480',
    issue_category: 'screen_display',
    issue_description: 'Dropped laptop, screen lines appearing. Need original display panel replacement.',
    urgency: 'standard',
    customer_name: 'Kavitha Ram',
    customer_phone: '+91 98410 99887',
    customer_email: 'kavitha.r@yahoo.com',
    address: '46, 8th Street, Tatabad Walk-In Counter',
    preferred_date: '2026-11-01',
    preferred_time_slot: '02:00 PM - 05:00 PM',
    status: 'submitted',
    estimated_cost: 299,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export const MOCK_INQUIRIES = [
  {
    _id: 'inq-01',
    name: 'Kiran Deshmukh',
    phone: '+91 98111 22334',
    email: 'kiran.d@example.com',
    subject: 'laptop_inquiry',
    message: 'Looking for 5 certified refurbished Lenovo ThinkPad laptops for our coaching institute. Need GST invoice and warranty details.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'inq-02',
    name: 'Ananya Joshi',
    phone: '+91 98222 33445',
    email: 'ananya.j@example.com',
    subject: 'cctv_printer',
    message: 'Need 4-camera CP PLUS CCTV system installed at our Tatabad apartment parking. When can a technician do site inspection?',
    status: 'contacted',
    response_note: 'Called customer, site visit booked for tomorrow 11 AM.',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString()
  }
];

// Local Storage Managers for Offline fallback persistence
export function getLocalProducts() {
  try {
    const saved = localStorage.getItem('techvick_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]._id && parsed[0]._id.startsWith('tvc-')) {
        return parsed;
      }
    }
  } catch {}
  return [...REAL_MARKET_PRODUCTS];
}

export function saveLocalProducts(products) {
  try {
    localStorage.setItem('techvick_products', JSON.stringify(products));
  } catch {}
}

export function getLocalOrders() {
  try {
    const saved = localStorage.getItem('techvick_orders');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...MOCK_ORDERS];
}

export function saveLocalOrders(orders) {
  try {
    localStorage.setItem('techvick_orders', JSON.stringify(orders));
  } catch {}
}

export function getLocalServiceRequests() {
  try {
    const saved = localStorage.getItem('techvick_services');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...MOCK_SERVICE_REQUESTS];
}

export function saveLocalServiceRequests(requests) {
  try {
    localStorage.setItem('techvick_services', JSON.stringify(requests));
  } catch {}
}

export function getLocalInquiries() {
  try {
    const saved = localStorage.getItem('techvick_inquiries');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...MOCK_INQUIRIES];
}

export function saveLocalInquiries(inquiries) {
  try {
    localStorage.setItem('techvick_inquiries', JSON.stringify(inquiries));
  } catch {}
}
