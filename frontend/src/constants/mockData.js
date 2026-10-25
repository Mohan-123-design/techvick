// TechMart Mock Data (Used as instant fallback when backend is offline)

export const MOCK_PRODUCTS = [
  // Laptops
  {
    _id: 'prod-lap-1',
    name: 'HP ProBook 450 G10 Business Laptop',
    category: 'laptops',
    brand: 'HP',
    price: 52990,
    original_price: 62990,
    rating: 4.8,
    review_count: 128,
    stock: 14,
    warranty_months: 24,
    is_featured: true,
    description: 'High performance enterprise laptop equipped with 13th Gen Intel Core i5 processor, fast PCIe NVMe SSD, and spill-resistant keyboard. Ideal for professional workstations and multi-tasking business applications.',
    specifications: {
      'Processor': 'Intel Core i5-1335U (10 Cores, up to 4.6 GHz)',
      'RAM': '16GB DDR4 3200MHz (Expandable to 32GB)',
      'Storage': '512GB NVMe M.2 SSD',
      'Display': '15.6" FHD (1920x1080) Anti-glare IPS 300 nits',
      'Graphics': 'Intel Iris Xe Graphics',
      'OS': 'Windows 11 Pro Genuine',
      'Warranty': '2 Years On-Site & In-Store Warranty'
    },
    inStoreAvailability: 'Available at Main Store (Aisle B3)',
    badge: 'Best Seller'
  },
  {
    _id: 'prod-lap-2',
    name: 'Lenovo ThinkPad E14 Gen 5 Workstation',
    category: 'laptops',
    brand: 'Lenovo',
    price: 59990,
    original_price: 71500,
    rating: 4.9,
    review_count: 94,
    stock: 8,
    warranty_months: 36,
    is_featured: true,
    description: 'Military-grade durability, iconic TrackPoint, and robust security features make the ThinkPad E14 the top choice for software developers, accountants, and engineers.',
    specifications: {
      'Processor': 'AMD Ryzen 7 7730U (8 Cores, 16 Threads)',
      'RAM': '16GB DDR4 3200MHz',
      'Storage': '1TB NVMe PCIe 4.0 SSD',
      'Display': '14.0" WUXGA (1920x1200) IPS 100% sRGB',
      'Keyboard': 'Backlit Ergonomic with TrackPoint',
      'OS': 'Windows 11 Pro',
      'Warranty': '3 Years Premier Support Warranty'
    },
    inStoreAvailability: 'In Stock (TechMart City Center)',
    badge: 'TechMart Choice'
  },
  {
    _id: 'prod-lap-3',
    name: 'Dell Vostro 3520 Reliable Office Laptop',
    category: 'laptops',
    brand: 'Dell',
    price: 35490,
    original_price: 43900,
    rating: 4.5,
    review_count: 156,
    stock: 22,
    warranty_months: 12,
    is_featured: false,
    description: 'Budget-friendly and dependable laptop designed for school, college, accounting, and general home computing with rapid battery charging.',
    specifications: {
      'Processor': 'Intel Core i3-1215U (6 Cores)',
      'RAM': '8GB DDR4 (Expandable)',
      'Storage': '512GB High-speed SSD',
      'Display': '15.6" FHD 120Hz Anti-Glare Display',
      'OS': 'Windows 11 Home + MS Office Home & Student',
      'Warranty': '1 Year Dell Hardware Warranty'
    },
    inStoreAvailability: 'Ready for Store Pickup & Same-Day Delivery'
  },
  {
    _id: 'prod-lap-4',
    name: 'ASUS TUF Gaming A15 High-Performance Rig',
    category: 'laptops',
    brand: 'ASUS',
    price: 64990,
    original_price: 79990,
    rating: 4.7,
    review_count: 82,
    stock: 6,
    warranty_months: 24,
    is_featured: true,
    description: 'Geared for serious gaming and high-demand 3D CAD rendering. Dual fans with anti-dust technology ensure sustained cooling over long working sessions.',
    specifications: {
      'Processor': 'AMD Ryzen 7 7435HS',
      'RAM': '16GB DDR5 4800MHz',
      'Storage': '512GB Gen4 NVMe SSD',
      'Graphics': 'NVIDIA GeForce RTX 3050 4GB GDDR6',
      'Display': '15.6" FHD 144Hz IPS vSync',
      'Warranty': '2 Years International Warranty'
    },
    inStoreAvailability: 'Demo unit available in showroom',
    badge: 'Heavy Duty'
  },

  // Desktops
  {
    _id: 'prod-dsk-1',
    name: 'TechMart Custom Core i7 Pro Creator Desktop',
    category: 'desktops',
    brand: 'TechMart Assembled',
    price: 48990,
    original_price: 58000,
    rating: 4.9,
    review_count: 67,
    stock: 10,
    warranty_months: 36,
    is_featured: true,
    description: 'Custom assembled by certified TechMart technicians with premium components, copper heat sinks, and gold-rated power supply. Fully tested for 48 hours burn-in stability.',
    specifications: {
      'Processor': 'Intel Core i7-12700 (12 Cores, 20 Threads)',
      'Motherboard': 'Gigabyte B760M Ultra Durable with Wi-Fi',
      'RAM': '32GB Corsair Vengeance DDR4 3200MHz',
      'Storage': '1TB Kingston NV2 PCIe 4.0 SSD',
      'Cabinet': 'Ant Esports Mid-Tower with 4 ARGB Fans',
      'PSU': 'Cooler Master 650W 80 Plus Bronze',
      'Warranty': '3 Years Component-Level Store Warranty'
    },
    inStoreAvailability: 'Pre-assembled & tested units available in-store',
    badge: 'Store Special'
  },
  {
    _id: 'prod-dsk-2',
    name: 'HP 24-inch All-in-One Desktop PC',
    category: 'desktops',
    brand: 'HP',
    price: 44990,
    original_price: 52990,
    rating: 4.6,
    review_count: 43,
    stock: 9,
    warranty_months: 24,
    is_featured: false,
    description: 'Clean cable-free setup for reception, clinic, accounting, and home office desks. Integrated FHD pop-up privacy camera and dual array microphones.',
    specifications: {
      'Processor': 'Intel Core i3 13th Gen',
      'RAM': '8GB DDR4',
      'Storage': '512GB SSD',
      'Display': '23.8" FHD Micro-edge Anti-glare Touchscreen',
      'Peripherals': 'HP Wireless Keyboard & Mouse Combo Included',
      'Warranty': '2 Years On-Site Warranty'
    },
    inStoreAvailability: 'Available at Store'
  },

  // Servers
  {
    _id: 'prod-srv-1',
    name: 'Dell PowerEdge T150 Tower Server',
    category: 'servers',
    brand: 'Dell',
    price: 94990,
    original_price: 112000,
    rating: 5.0,
    review_count: 19,
    stock: 4,
    warranty_months: 36,
    is_featured: true,
    description: 'Enterprise entry tower server engineered for billing software (Tally, SAP), centralized database management, and active directory services.',
    specifications: {
      'Processor': 'Intel Xeon E-2314 (4 Cores, 2.8GHz)',
      'Memory': '32GB DDR4 ECC UDIMM',
      'RAID Controller': 'PERC H355 RAID Adapter (Supports RAID 0, 1, 10)',
      'Hard Drives': '2x 2TB 7.2K RPM Enterprise SATA HDD (Hot-plug)',
      'Network': 'Dual Port Gigabit Ethernet Broadcom',
      'Warranty': '3 Years Dell ProSupport Next Business Day On-Site'
    },
    inStoreAvailability: 'Available for immediate dispatch / site commissioning',
    badge: 'Enterprise'
  },

  // Printers
  {
    _id: 'prod-prn-1',
    name: 'Epson EcoTank L3250 Wi-Fi All-in-One Ink Tank Printer',
    category: 'printers',
    brand: 'Epson',
    price: 13990,
    original_price: 16999,
    rating: 4.7,
    review_count: 310,
    stock: 25,
    warranty_months: 24,
    is_featured: true,
    description: 'Ultra-low cost printing at only 9 paise per black and 24 paise per color print. Includes Wi-Fi Direct and seamless mobile printing via Epson Smart Panel.',
    specifications: {
      'Functions': 'Print, Scan, Copy with Flatbed',
      'Print Resolution': '5760 x 1440 dpi',
      'Page Yield': 'Up to 4,500 Black & 7,500 Color Pages per refill',
      'Connectivity': 'Wi-Fi, Wi-Fi Direct, USB 2.0',
      'Warranty': '2 Years or 30,000 pages (Free onsite installation)'
    },
    inStoreAvailability: 'Demo unit in store. Extra refill inks in stock.',
    badge: 'Low Cost King'
  },
  {
    _id: 'prod-prn-2',
    name: 'Canon imageCLASS LBP2900B Monochrome Laser Printer',
    category: 'printers',
    brand: 'Canon',
    price: 14490,
    original_price: 17250,
    rating: 4.8,
    review_count: 420,
    stock: 18,
    warranty_months: 12,
    is_featured: false,
    description: 'The legendary workhorse printer trusted by millions of Indian offices and advocate chambers. Instant warm-up and zero paper jam reputation.',
    specifications: {
      'Print Speed': '12 pages per minute (A4)',
      'Cartridge Type': 'Canon 303 (Easily refillable at just ₹250)',
      'Input Tray': '150-sheet universal cassette',
      'Warranty': '1 Year Canon Manufacturer Warranty'
    },
    inStoreAvailability: 'In Stock'
  },

  // CCTV & Cameras
  {
    _id: 'prod-cctv-1',
    name: 'CP PLUS 4-Channel 5MP Ultra HD Surveillance System Kit',
    category: 'cctv',
    brand: 'CP PLUS',
    price: 11490,
    original_price: 15990,
    rating: 4.8,
    review_count: 88,
    stock: 15,
    warranty_months: 24,
    is_featured: true,
    description: 'Complete home & shop surveillance bundle with 4 weather-proof night-vision cameras, 4-channel DVR, 1TB Seagate SkyHawk surveillance HDD, power supply, and BNC connectors. Free site installation support available.',
    specifications: {
      'Cameras Included': '2 Bullet (Outdoor IP66) + 2 Dome (Indoor)',
      'Resolution': '5 Megapixel Ultra HD (2560x1920)',
      'Night Vision': 'Infrared up to 30 Meters Smart IR',
      'Storage': '1TB Surveillance grade 24/7 HDD Included',
      'Remote View': 'gCMOB Mobile App (Android/iOS)',
      'Warranty': '2 Years Replacement Warranty'
    },
    inStoreAvailability: 'Ready kit in stock + Site Installation Technician Available',
    badge: 'Complete Kit'
  },
  {
    _id: 'prod-cctv-2',
    name: 'Hikvision 8-Channel 4K ColorVu IP CCTV System',
    category: 'cctv',
    brand: 'Hikvision',
    price: 24990,
    original_price: 32500,
    rating: 4.9,
    review_count: 51,
    stock: 7,
    warranty_months: 36,
    is_featured: true,
    description: 'Full-time color night vision cameras with built-in mic for two-way audio. Powered by PoE (Power over Ethernet) requiring only a single network cable per camera.',
    specifications: {
      'Technology': 'ColorVu 24/7 Full Color Day & Night',
      'Audio': 'Built-in Noise Canceling Microphone in each camera',
      'Smart AI': 'Human and Vehicle AcuSense Classification',
      'Storage': 'Supports up to 8TB SATA HDD',
      'Warranty': '3 Years Hikvision Warranty + 1 Year TechMart Service Visit'
    },
    inStoreAvailability: 'Specialist installation available upon booking',
    badge: 'Color Night Vision'
  },

  // Accessories
  {
    _id: 'prod-acc-1',
    name: 'Logitech MK295 Silent Wireless Keyboard & Mouse Combo',
    category: 'accessories',
    brand: 'Logitech',
    price: 2190,
    original_price: 2995,
    rating: 4.7,
    review_count: 240,
    stock: 35,
    warranty_months: 36,
    is_featured: false,
    description: 'SilentTouch technology removes over 90% of distracting typing and clicking noises. Up to 36 months keyboard and 18 months mouse battery lifespan.',
    specifications: {
      'Wireless Range': '10 Meters via 2.4GHz Nano USB Receiver',
      'Spill Resistant': 'Tested up to 60ml liquid spills',
      'Warranty': '3 Years Limited Hardware Warranty'
    },
    inStoreAvailability: 'In Stock'
  },
  {
    _id: 'prod-acc-2',
    name: 'Crucial BX500 1TB 3D NAND SATA 2.5-Inch Internal SSD',
    category: 'accessories',
    brand: 'Crucial by Micron',
    price: 5490,
    original_price: 7500,
    rating: 4.8,
    review_count: 180,
    stock: 40,
    warranty_months: 36,
    is_featured: false,
    description: 'Breathe instant new life into slow laptops and desktops. 300% faster boot times and responsive application launches with free data migration support at our counter.',
    specifications: {
      'Speed': 'Up to 540 MB/s Sequential Read',
      'Form Factor': '2.5-inch 7mm SATA III',
      'Installation': 'Free cloning & installation at TechMart store',
      'Warranty': '3 Years Crucial Official Warranty'
    },
    inStoreAvailability: 'Over 50 units in stock'
  },

  // Networking
  {
    _id: 'prod-net-1',
    name: 'TP-Link Archer AX73 Dual-Band Gigabit Wi-Fi 6 Router',
    category: 'networking',
    brand: 'TP-Link',
    price: 7990,
    original_price: 10999,
    rating: 4.8,
    review_count: 95,
    stock: 12,
    warranty_months: 36,
    is_featured: true,
    description: 'Stream 8K video, buffer-free gaming, and handle 200+ connected smart devices simultaneously with 5400 Mbps Wi-Fi 6 speeds and 6 external high-gain antennas.',
    specifications: {
      'Speed': '4804 Mbps on 5GHz + 574 Mbps on 2.4GHz',
      'Ports': '1x Gigabit WAN + 4x Gigabit LAN + USB 3.0 Port',
      'Security': 'HomeShield WPA3, Real-Time IoT Protection',
      'Warranty': '3 Years Replacement Warranty'
    },
    inStoreAvailability: 'In Stock with on-site technician config available'
  },
  {
    _id: 'prod-net-2',
    name: 'D-Link 16-Port Gigabit Unmanaged Metal Rackmount Switch',
    category: 'networking',
    brand: 'D-Link',
    price: 4290,
    original_price: 5600,
    rating: 4.9,
    review_count: 62,
    stock: 14,
    warranty_months: 36,
    is_featured: false,
    description: 'Plug-and-play heavy duty metal casing switch designed for expanding wired networks in offices, hospitals, schools, and CCTV networks.',
    specifications: {
      'Port Configuration': '16x 10/100/1000 Mbps Auto MDI/MDIX',
      'Casing': 'Durable Fanless Silent Metal Enclosure',
      'Green Ethernet': 'Energy-efficient IEEE 802.3az standard',
      'Warranty': '3 Years Warranty'
    },
    inStoreAvailability: 'In Stock'
  }
];

export const MOCK_WARRANTIES = {
  'TM-LAP-2024-001': {
    serialNumber: 'TM-LAP-2024-001',
    customerName: 'Suresh Raina',
    customerPhone: '+91 98765 11223',
    productName: 'HP ProBook 450 G10 Business Laptop',
    category: 'Laptops',
    purchaseDate: '2024-02-15',
    expiryDate: '2026-02-15',
    status: 'Active',
    coverage: 'Comprehensive Hardware & On-Site Support',
    storeLocation: 'TechMart Main Branch, Shop 102',
    invoiceNumber: 'INV-2024-4821',
    remainingDays: 478
  },
  'TM-PRN-2024-089': {
    serialNumber: 'TM-PRN-2024-089',
    customerName: 'Meena Sundaram',
    customerPhone: '+91 98401 77654',
    productName: 'Epson EcoTank L3250 Wi-Fi All-in-One Printer',
    category: 'Printers',
    purchaseDate: '2023-11-10',
    expiryDate: '2025-11-10',
    status: 'Active',
    coverage: 'Print Head & Logic Board Warranty',
    storeLocation: 'TechMart Service Hub, North Zone',
    invoiceNumber: 'INV-2023-9014',
    remainingDays: 381
  },
  'TM-CAM-2024-112': {
    serialNumber: 'TM-CAM-2024-112',
    customerName: 'Aditya Birla Chemicals Lab',
    customerPhone: '+91 94440 22334',
    productName: 'Hikvision 8-Channel 4K ColorVu IP CCTV System',
    category: 'CCTV & Cameras',
    purchaseDate: '2024-01-20',
    expiryDate: '2027-01-20',
    status: 'Active',
    coverage: '3-Year Enterprise Replacement + Annual AMC Included',
    storeLocation: 'TechMart Corporate Services Desk',
    invoiceNumber: 'INV-2024-1102',
    remainingDays: 817
  },
  'TM-EXP-2022-999': {
    serialNumber: 'TM-EXP-2022-999',
    customerName: 'Kavitha Ram',
    customerPhone: '+91 97890 55443',
    productName: 'Dell Vostro 3520 Laptop',
    category: 'Laptops',
    purchaseDate: '2022-03-01',
    expiryDate: '2023-03-01',
    status: 'Expired',
    coverage: 'Standard 1-Year Limited Warranty (Renewable under AMC)',
    storeLocation: 'TechMart Main Branch',
    invoiceNumber: 'INV-2022-2201',
    remainingDays: 0
  }
};
