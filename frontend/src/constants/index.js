// TechMart Constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const STORE_INFO = {
  name: 'TechMart',
  tagline: 'Sales & Service',
  description: 'Your Trusted Electronics Sales & Service Partner',
  phone: '+91 98765 43210',
  altPhone: '+91 98765 43211',
  email: 'info@techmart.in',
  supportEmail: 'support@techmart.in',
  address: '123, Main Road, Tech Hub Complex, Near Bus Stand',
  city: 'Your City',
  state: 'Your State',
  pincode: '600001',
  workingHours: 'Mon - Sat: 9:30 AM - 8:00 PM',
  sundayHours: 'Sunday: 10:00 AM - 2:00 PM',
  mapUrl: 'https://maps.google.com',
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    youtube: '#',
    whatsapp: 'https://wa.me/919876543210',
  },
};

export const CATEGORIES = [
  {
    id: 'laptops',
    name: 'Laptops',
    icon: '💻',
    description: 'Business, gaming & personal laptops from top brands',
    color: '#3b82f6',
  },
  {
    id: 'desktops',
    name: 'Desktops',
    icon: '🖥️',
    description: 'Custom-built & branded desktop computers',
    color: '#8b5cf6',
  },
  {
    id: 'servers',
    name: 'Servers',
    icon: '🗄️',
    description: 'Enterprise servers & network storage solutions',
    color: '#06b6d4',
  },
  {
    id: 'printers',
    name: 'Printers',
    icon: '🖨️',
    description: 'Inkjet, laser & multifunction printers',
    color: '#10b981',
  },
  {
    id: 'cctv',
    name: 'CCTV & Cameras',
    icon: '📷',
    description: 'Security cameras, DVRs & surveillance systems',
    color: '#f59e0b',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: '🖱️',
    description: 'Keyboards, mice, cables, adapters & peripherals',
    color: '#ec4899',
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
    description: 'Routers, switches, access points & cabling',
    color: '#14b8a6',
  },
];

export const SERVICES = [
  {
    id: 'repair',
    name: 'Repair Service',
    icon: '🔧',
    description: 'Expert hardware & software repair for all devices. We fix laptops, desktops, printers, and more.',
    features: ['Same-day repair', '90-day repair warranty', 'Genuine parts'],
    price: 'Starting ₹299',
  },
  {
    id: 'maintenance',
    name: 'Annual Maintenance',
    icon: '🛡️',
    description: 'AMC plans for worry-free device maintenance. Regular checkups, priority support, and cost savings.',
    features: ['Unlimited visits', 'Priority support', 'Discounted parts'],
    price: 'Starting ₹2,999/year',
  },
  {
    id: 'site_visit',
    name: 'Site Visit Service',
    icon: '🏠',
    description: 'Our technicians come to your home or office. No need to carry heavy equipment to the store.',
    features: ['Doorstep service', '2-hour response', 'All areas covered'],
    price: 'Starting ₹499',
  },
  {
    id: 'installation',
    name: 'Installation',
    icon: '⚙️',
    description: 'Professional setup & installation for computers, networks, CCTV, and software.',
    features: ['Expert setup', 'Configuration included', 'Testing & handover'],
    price: 'Starting ₹599',
  },
  {
    id: 'data_recovery',
    name: 'Data Recovery',
    icon: '💾',
    description: 'Recover lost or corrupted data from hard drives, SSDs, pen drives, and memory cards.',
    features: ['High success rate', 'Confidential', 'No data, no charge'],
    price: 'Starting ₹999',
  },
  {
    id: 'networking_setup',
    name: 'Network Setup',
    icon: '🌐',
    description: 'Complete LAN, Wi-Fi, and network infrastructure setup for homes and offices.',
    features: ['Site survey', 'Professional cabling', 'Security config'],
    price: 'Starting ₹1,499',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    text: 'TechMart set up our entire office with 15 computers, a server, and network. Their service is exceptional and the prices are very competitive. Highly recommended!',
    rating: 5,
    avatar: 'RK',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Freelance Designer',
    text: 'Bought my work laptop from TechMart. They helped me choose the perfect specs for design work. The site visit repair service saved me when my laptop crashed before a deadline!',
    rating: 5,
    avatar: 'PS',
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    role: 'School Principal',
    text: 'We purchased 30 desktops and printers for our computer lab. TechMart provided excellent bulk pricing, installation, and continues to maintain all equipment under AMC.',
    rating: 5,
    avatar: 'MA',
  },
  {
    id: 4,
    name: 'Lakshmi Narayanan',
    role: 'Home User',
    text: 'The CCTV installation was done perfectly. Their technician explained everything clearly. The mobile app setup for remote viewing was a great bonus. Very professional team!',
    rating: 4,
    avatar: 'LN',
  },
  {
    id: 5,
    name: 'Anand Verma',
    role: 'Startup Founder',
    text: 'TechMart is our go-to for all IT needs. From networking setup to laptop repairs, they handle everything. Their AMC plan gives us peace of mind. Affordable and reliable!',
    rating: 5,
    avatar: 'AV',
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: '💰',
    title: 'Affordable Pricing',
    description: 'Best prices in town with transparent billing. No hidden charges, ever.',
  },
  {
    icon: '✅',
    title: 'Quality Assurance',
    description: 'Only genuine products and certified parts. Quality you can trust.',
  },
  {
    icon: '🛡️',
    title: 'Product Warranty',
    description: 'Comprehensive warranty on all products. Extended warranty options available.',
  },
  {
    icon: '🏠',
    title: 'Site Visit Service',
    description: 'Doorstep repair and installation service. We come to your home or office.',
  },
  {
    icon: '⚡',
    title: 'Quick Turnaround',
    description: 'Same-day repair for most issues. Minimal downtime guaranteed.',
  },
  {
    icon: '🎓',
    title: 'Expert Technicians',
    description: 'Certified technicians with 10+ years of experience in the industry.',
  },
];
