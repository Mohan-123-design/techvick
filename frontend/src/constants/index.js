// TECHVICK COMPUTERS Constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const STORE_INFO = {
  name: 'Techvick Computers',
  tagline: 'Taking Care of Your PC',
  subheading: 'Sales & Service',
  description: 'Your Premier Multi-Brand Laptop, Desktop, iMac, Printer & CCTV Sales and Service Center in Gandhipuram, Coimbatore.',
  phone: '+91 94433 87654',
  altPhone: '+91 98422 12345',
  email: 'techvickcomputers@gmail.com',
  supportEmail: 'techvickcomputers@gmail.com',
  address: '46, 8th Street, Tatabad, Gandhipuram',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  pincode: '641012',
  landmark: 'Near 100 Feet Road, Tatabad',
  workingHours: 'Mon - Sat: 9:30 AM - 8:30 PM',
  sundayHours: 'Sunday: Emergency & By Appointment',
  mapUrl: 'https://maps.app.goo.gl/H3MJa6TsbUeYGvCc9',
  mapEmbedUrl: 'https://maps.google.com/maps?q=46%208th%20Street%20Tatabad%20Gandhipuram%20Coimbatore%20641012&t=&z=15&ie=UTF8&iwloc=&output=embed',
  social: {
    facebook: '#',
    instagram: '#',
    whatsapp: 'https://wa.me/919443387654?text=Hello%20Techvick%20Computers,%20I%20would%20like%20to%20inquire%20about%20your%20services/products',
  },
};

// 12 Authorized Brand Partners from Business Card
export const SERVICED_BRANDS = [
  { name: 'Sony', slug: 'sony', color: '#ffffff', category: 'Laptops & Audio' },
  { name: 'ASUS', slug: 'asus', color: '#00539b', category: 'ROG, ZenBook & Gaming' },
  { name: 'MSI', slug: 'msi', color: '#ff0000', category: 'Motherboards & Gaming' },
  { name: 'HP', slug: 'hp', color: '#0096d6', category: 'Pavilion, ProBook & Printers' },
  { name: 'Apple', slug: 'apple', color: '#a2aaad', category: 'MacBook, iMac & Mac Mini' },
  { name: 'NVIDIA', slug: 'nvidia', color: '#76b900', category: 'RTX GPUs & AI Hardware' },
  { name: 'AMD', slug: 'amd', color: '#ed1c24', category: 'Ryzen CPUs & Radeon GPUs' },
  { name: 'Intel', slug: 'intel', color: '#0071c5', category: 'Core i3/i5/i7/i9 Processors' },
  { name: 'Samsung', slug: 'samsung', color: '#1428a0', category: 'NVMe SSDs & Curved Displays' },
  { name: 'Dell', slug: 'dell', color: '#007db8', category: 'Latitude, XPS & Vostro' },
  { name: 'Acer', slug: 'acer', color: '#83b81a', category: 'Aspire, Predator & Nitro' },
  { name: 'Lenovo', slug: 'lenovo', color: '#e2231a', category: 'ThinkPad, IdeaPad & Legion' },
];

export const CATEGORIES = [
  {
    id: 'laptops',
    name: 'New & Used Laptops',
    icon: '💻',
    description: 'Certified pre-owned & brand new Dell, HP, Lenovo ThinkPad & MacBooks',
    color: '#0284c7',
  },
  {
    id: 'desktops',
    name: 'Desktops & iMac',
    icon: '🖥️',
    description: 'Apple iMac, business office desktops and all-in-one PCs',
    color: '#0ea5e9',
  },
  {
    id: 'pc-build',
    name: 'Custom PC Builds',
    icon: '⚡',
    description: 'High-performance Gaming, Video Editing & 3D Workstations',
    color: '#38bdf8',
  },
  {
    id: 'printers',
    name: 'Printers & Cartridges',
    icon: '🖨️',
    description: 'Epson EcoTank, HP LaserJet, Canon multifunction printers & repair',
    color: '#10b981',
  },
  {
    id: 'cctv-monitors',
    name: 'CCTV & Monitors',
    icon: '📷',
    description: 'HD surveillance cameras, DVRs, gaming & IPS office monitors',
    color: '#f59e0b',
  },
  {
    id: 'upgrades',
    name: 'Hardware & Upgrades',
    icon: '⚙️',
    description: 'Fast NVMe SSDs, RAM expansion, cooling & graphic cards',
    color: '#8b5cf6',
  },
  {
    id: 'networking',
    name: 'Networking & Data Recovery',
    icon: '🌐',
    description: 'Router setup, LAN cabling, and advanced clean-room data recovery',
    color: '#06b6d4',
  },
];

// Exact core services from business card back
export const SERVICES = [
  {
    id: 'laptops-desktops-imac',
    name: 'New & Used Laptops, Desktops, iMac',
    icon: '💻',
    badge: 'Popular',
    description: 'Sales of certified refurbished and brand-new laptops, desktops, and Apple iMacs with warranty and guaranteed performance.',
    features: ['100% Quality Checked', 'Free OS & Software Setup', 'Up to 1-Year Store Warranty'],
    price: 'Starting ₹8,999 (Used) / ₹24,990 (New)',
  },
  {
    id: 'printers-cctv-monitors',
    name: 'Printers, CCTV & Monitors',
    icon: '🖨️',
    badge: 'Security & Display',
    description: 'Sales, installation and servicing for laser printers, inkjet EcoTanks, high-res CCTV surveillance systems and LED/IPS monitors.',
    features: ['Epson/HP/Canon Support', 'Mobile Live CCTV View', 'Display Panel Repair'],
    price: 'Starting ₹399 (Service)',
  },
  {
    id: 'hardware-software-upgrade',
    name: 'Hardware & Software Upgrade',
    icon: '🚀',
    badge: 'Speed Boost',
    description: 'Transform sluggish computers into lightning-fast machines with high-speed SSDs, RAM expansion, OS reinstallations, and thermal repasting.',
    features: ['10x Faster Boot Time', 'Crucial/Samsung SSDs', 'Done in 45 Minutes'],
    price: 'Starting ₹499',
  },
  {
    id: 'pc-build',
    name: 'Custom PC Build',
    icon: '🛠️',
    badge: 'Custom Crafted',
    description: 'Tailor-made rigs for 1080p/1440p/4K gaming, architecture CAD, video editing, and heavy institutional workloads.',
    features: ['Cable Management', 'Stress & Thermal Tested', 'Full Component Warranty'],
    price: 'Budget & High-End Builds',
  },
  {
    id: 'networking-data-recovery',
    name: 'Networking & Data Recovery',
    icon: '💾',
    badge: 'Critical Care',
    description: 'Professional data restoration from dead hard drives, SSDs, corrupted flash drives, plus complete office Wi-Fi and LAN infrastructure.',
    features: ['Strict Privacy Guarantee', 'Clean Room Extraction', 'No Recovery, No Fee'],
    price: 'Starting ₹799',
  },
  {
    id: 'doorstep-service',
    name: 'Doorstep & On-Site Service',
    icon: '🚗',
    badge: 'Coimbatore Wide',
    description: 'Cannot bring your PC to Tatabad? Our mobile service technician visits your residence or office anywhere in Coimbatore.',
    features: ['Prompt Visit', 'Transparent Billing', 'Convenient & Fast'],
    price: 'Starting ₹349 Visit Charge',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Karthik Subramanian',
    role: 'Software Engineer, Gandhipuram',
    text: 'Upgraded my Lenovo ThinkPad with a 1TB Samsung NVMe SSD and 16GB RAM at Techvick Computers Tatabad. My laptop boots in 6 seconds now! Genuine pricing, no overcharging.',
    rating: 5,
    avatar: 'KS',
  },
  {
    id: 2,
    name: 'Meenakshi Sundaram',
    role: 'Studio Photographer, RS Puram',
    text: 'My Apple iMac display had power supply issues. Official service center quoted an exorbitant amount, but Techvick diagnosed and fixed the component board at a fraction of the cost. Highly recommended!',
    rating: 5,
    avatar: 'MS',
  },
  {
    id: 3,
    name: 'Vigneshwaran R.',
    role: 'Gamer & Content Creator, Saibaba Colony',
    text: 'Got my custom RTX 4060 + Ryzen 7 gaming rig built here. Flawless cable management, great thermal performance, and they provided genuine GST bills with full warranty.',
    rating: 5,
    avatar: 'VR',
  },
  {
    id: 4,
    name: 'Divya Bharathi',
    role: 'Principal, Tatabad Academy',
    text: 'Purchased 12 refurbished Dell desktops and set up CCTV surveillance for our institute. Techvick provided timely doorstep installation and continuous support under warranty.',
    rating: 5,
    avatar: 'DB',
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: '📍',
    title: 'Convenient Coimbatore Location',
    description: 'Located at 46, 8th Street, Tatabad, Gandhipuram — easily accessible from all parts of Coimbatore.',
  },
  {
    icon: '💎',
    title: 'Component-Level Repair',
    description: 'We repair chips, capacitors, and power circuits instead of forcing costly motherboard replacements.',
  },
  {
    icon: '🛡️',
    title: 'Direct Store Warranty',
    description: 'Clear written warranty terms on all sales and repairs with local instant counter support.',
  },
  {
    icon: '🏷️',
    title: 'Market-Beating Pricing',
    description: 'Transparent pricing benchmarked against real online rates like Amazon, plus in-store service perks.',
  },
  {
    icon: '⚡',
    title: 'Same-Day Quick Turnaround',
    description: 'Most SSD upgrades, screen replacements, and OS tune-ups completed within 1 to 3 hours.',
  },
  {
    icon: '🤝',
    title: 'Dedicated Store Staff',
    description: 'Friendly, qualified hardware technicians ready to explain problems in clear Tamil or English.',
  },
];
