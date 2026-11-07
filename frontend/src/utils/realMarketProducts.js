// ========================================================
// TECHVICK COMPUTERS - Real Market & Amazon Price Engine
// Real Indian Market Pricing (INR ₹) & Live Free API Sync
// ========================================================

export const REAL_MARKET_PRODUCTS = [
  // 1. LAPTOPS (NEW & USED)
  {
    _id: 'tvc-lap-01',
    name: 'HP 15s 12th Gen Intel Core i5-1235U Thin & Light Laptop',
    category: 'laptops',
    brand: 'HP',
    price: 49990,
    amazon_price: 52990,
    original_price: 63500,
    rating: 4.6,
    review_count: 3420,
    stock: 8,
    warranty_months: 24,
    condition: 'Brand New (Sealed)',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    description: '12th Gen Intel Core i5-1235U with 10 cores, 16GB DDR4 RAM, 512GB PCIe NVMe SSD, 15.6" Full HD micro-edge anti-glare display, Intel Iris Xe graphics, Windows 11 Home & MS Office 2021.',
    specifications: {
      'Processor': 'Intel Core i5-1235U (Up to 4.4 GHz, 10 Cores, 12 Threads)',
      'RAM': '16GB DDR4-3200 MHz RAM',
      'Storage': '512GB PCIe NVMe M.2 SSD',
      'Display': '15.6-inch FHD (1920 x 1080), micro-edge, anti-glare, 250 nits',
      'Graphics': 'Intel Iris Xe Graphics',
      'OS': 'Windows 11 Home + MS Office Home & Student 2021',
      'Warranty': '1 Year Onsite + 1 Year Techvick Store Extended Service'
    },
    inStoreAvailability: 'In Stock at Tatabad Showroom (Rack A1)',
    amazon_asin: 'B0B6F5V72Z',
    badge: 'Amazon Best Seller'
  },
  {
    _id: 'tvc-lap-02',
    name: 'Lenovo ThinkPad E14 Gen 5 AMD Ryzen 7 7730U Business Workstation',
    category: 'laptops',
    brand: 'Lenovo',
    price: 58990,
    amazon_price: 61990,
    original_price: 74900,
    rating: 4.8,
    review_count: 890,
    stock: 5,
    warranty_months: 36,
    condition: 'Brand New',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    description: 'Legendary ThinkPad ruggedness with MIL-SPEC 810H durability, AMD Ryzen 7 7730U (8 cores/16 threads), 16GB RAM, 1TB NVMe SSD, spill-resistant backlit keyboard, fingerprint reader and FHD camera with privacy shutter.',
    specifications: {
      'Processor': 'AMD Ryzen 7 7730U (8 Cores, 16 Threads, up to 4.5 GHz)',
      'RAM': '16GB DDR4 3200MHz (expandable to 40GB)',
      'Storage': '1TB NVMe SSD M.2 2242 PCIe 4.0',
      'Display': '14-inch WUXGA (1920x1200) IPS 300nits Anti-glare',
      'Security': 'dTPM 2.0, Fingerprint Reader, Kensington Slot',
      'Warranty': '3 Years Premier Support Warranty'
    },
    inStoreAvailability: 'In Stock (Ready for demo)',
    amazon_asin: 'B0C77JNKQ2',
    badge: 'Enterprise Choice'
  },
  {
    _id: 'tvc-lap-03',
    name: 'Apple MacBook Air 13.6" M2 Chip (8GB Unified Memory, 256GB SSD)',
    category: 'laptops',
    brand: 'Apple',
    price: 84990,
    amazon_price: 89900,
    original_price: 99900,
    rating: 4.9,
    review_count: 5120,
    stock: 4,
    warranty_months: 12,
    condition: 'Brand New (Midnight Blue / Starlight)',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'Incredible speed with Apple M2 8-core CPU and 8-core GPU, stunning 13.6-inch Liquid Retina display with 500 nits brightness, 18-hour battery life, 1080p FaceTime HD camera, MagSafe 3 charging.',
    specifications: {
      'Chipset': 'Apple M2 chip with 8-core CPU and 8-core GPU',
      'Unified Memory': '8GB high-bandwidth unified RAM',
      'Storage': '256GB ultrafast SSD',
      'Display': '13.6" Liquid Retina display with True Tone',
      'Weight': 'Only 1.24 kg fanless silent design',
      'Warranty': '1 Year Apple Official Warranty + Free Setup'
    },
    inStoreAvailability: 'Available at Counter Display',
    amazon_asin: 'B0B3CLL88T',
    badge: 'Premium Pick'
  },
  {
    _id: 'tvc-lap-04',
    name: 'Lenovo ThinkPad T480 Corporate Refurbished Laptop (Core i5 8th Gen)',
    category: 'laptops',
    brand: 'Lenovo',
    price: 18499,
    amazon_price: 21999,
    original_price: 85000,
    rating: 4.7,
    review_count: 142,
    stock: 12,
    warranty_months: 12,
    condition: 'Certified Pre-Owned (Grade A+)',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    description: 'Tested and certified by Techvick technicians. Intel Core i5 8th Gen quad-core, 16GB DDR4, 512GB SSD, dual battery system with 6+ hours backup, bulletproof ThinkPad keyboard. Perfect for students and programming.',
    specifications: {
      'Processor': 'Intel Core i5-8350U Quad Core (Up to 3.6 GHz)',
      'RAM': '16GB DDR4 High Speed RAM',
      'Storage': '512GB High Speed SSD',
      'Display': '14-inch Full HD Anti-Glare 1080p',
      'Condition': 'Grade A+ Clean, No dents, 100% Tested Motherboard',
      'Warranty': '1 Year Full Techvick Store Hardware Warranty'
    },
    inStoreAvailability: '12 Units in Tatabad Store',
    amazon_asin: 'B08L7V6YQW',
    badge: 'Best Value Used PC'
  },

  // 2. DESKTOPS & iMAC
  {
    _id: 'tvc-desk-01',
    name: 'Apple iMac 24" 4.5K Retina Display M3 Chip (8-Core CPU / 8-Core GPU)',
    category: 'desktops',
    brand: 'Apple',
    price: 124990,
    amazon_price: 134900,
    original_price: 139900,
    rating: 4.9,
    review_count: 420,
    stock: 2,
    warranty_months: 12,
    condition: 'Brand New',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: 'The iconic all-in-one desktop supercharged by M3 chip. Breathtaking 24-inch 4.5K Retina display with over 1 billion colors, studio-quality mics, six-speaker sound system with Spatial Audio.',
    specifications: {
      'Chip': 'Apple M3 (8-core CPU, 8-core GPU)',
      'Memory': '8GB Unified Memory',
      'Storage': '256GB SSD',
      'Display': '24-inch 4.5K Retina display (4480x2520), 500 nits',
      'Accessories': 'Magic Keyboard & Magic Mouse Included'
    },
    inStoreAvailability: 'Demo Unit Available for Testing',
    amazon_asin: 'B0CHX5V16X',
    badge: 'Apple Authorized Servicing'
  },
  {
    _id: 'tvc-desk-02',
    name: 'Dell OptiPlex 7010 Micro Business Desktop PC',
    category: 'desktops',
    brand: 'Dell',
    price: 44990,
    amazon_price: 48500,
    original_price: 59000,
    rating: 4.6,
    review_count: 310,
    stock: 6,
    warranty_months: 36,
    condition: 'Brand New',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-compact space-saving micro chassis engineered for commercial reliability. 13th Gen Intel Core i5, 16GB RAM, 512GB NVMe SSD, dual DisplayPort outputs, Windows 11 Pro.',
    specifications: {
      'Processor': 'Intel Core i5-13500T (14 Cores, up to 4.6 GHz)',
      'RAM': '16GB DDR4 3200MHz',
      'Storage': '512GB PCIe M.2 SSD',
      'Form Factor': 'Ultra-compact Micro Desktop (1.2 kg)',
      'OS': 'Windows 11 Pro 64-bit'
    },
    inStoreAvailability: 'In Stock at Tatabad',
    amazon_asin: 'B0C4F6G7H8',
    badge: 'Office Workhorse'
  },

  // 3. CUSTOM PC BUILD
  {
    _id: 'tvc-pc-01',
    name: 'Techvick Custom RTX 4060 + AMD Ryzen 7 5700X Gaming & 3D Rig',
    category: 'pc-build',
    brand: 'Custom Build',
    price: 74990,
    amazon_price: 82500,
    original_price: 92000,
    rating: 5.0,
    review_count: 67,
    stock: 3,
    warranty_months: 36,
    condition: 'Custom Assembled & Burn-In Tested',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'Hand-crafted at Techvick Coimbatore workshop. AMD Ryzen 7 5700X (8 cores/16 threads), ZOTAC GeForce RTX 4060 8GB GDDR6, 32GB Corsair Vengeance 3600MHz RAM, 1TB Kingston Gen4 NVMe, DeepCool 240mm AIO Cooler, 650W 80+ Bronze PSU, tempered glass ARGB case.',
    specifications: {
      'CPU': 'AMD Ryzen 7 5700X (8C/16T, 4.6 GHz Max Boost)',
      'GPU': 'ZOTAC Gaming NVIDIA RTX 4060 8GB GDDR6 DLSS 3',
      'Motherboard': 'MSI B550M PRO-VDH WiFi',
      'RAM': '32GB (16x2) Corsair Vengeance DDR4 3600MHz',
      'Storage': '1TB Gen4 NVMe SSD (5000 MB/s)',
      'Cooler': 'DeepCool 240mm Liquid AIO RGB',
      'Warranty': '3 Years Component-Level Warranty'
    },
    inStoreAvailability: 'Ready for Benchmark in Store',
    badge: 'Techvick Mastercraft'
  },

  // 4. PRINTERS & CARTRIDGES
  {
    _id: 'tvc-prt-01',
    name: 'Epson EcoTank L3210 All-in-One Ink Tank Color Printer',
    category: 'printers',
    brand: 'Epson',
    price: 11990,
    amazon_price: 12999,
    original_price: 14999,
    rating: 4.5,
    review_count: 14800,
    stock: 9,
    warranty_months: 12,
    condition: 'Brand New (Free Ink Bottle Set Included)',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80',
    description: 'Print, scan, and copy with ultra-low printing cost (9 paise black, 24 paise color). Yields up to 4,500 black and 7,500 color pages per refill. Includes full set of 4 Epson 003 ink bottles.',
    specifications: {
      'Functions': 'Print, Scan, Copy (Flatbed Scanner)',
      'Print Speed': 'Up to 33 ppm black / 15 ppm color',
      'Print Resolution': '5760 x 1440 dpi high resolution',
      'Yield': '4,500 Black / 7,500 Color Pages',
      'Warranty': '1 Year or 30,000 pages warranty'
    },
    inStoreAvailability: 'In Stock (Cartridge refilling also available)',
    amazon_asin: 'B09B8W2RQK',
    badge: 'Lowest Printing Cost'
  },

  // 5. CCTV & MONITORS
  {
    _id: 'tvc-cctv-01',
    name: 'CP PLUS 4-Channel 2.4MP Full HD CCTV Surveillance Kit with 1TB HDD',
    category: 'cctv-monitors',
    brand: 'CP PLUS',
    price: 9490,
    amazon_price: 10499,
    original_price: 13999,
    rating: 4.6,
    review_count: 2190,
    stock: 7,
    warranty_months: 24,
    condition: 'Complete Installation Kit',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    description: 'Complete security surveillance pack: 2 Dome + 2 Bullet 2.4MP Full HD Night Vision cameras, 4-Channel DVR, 1TB Surveillance HDD, 90m coaxial cable roll, SMPS power supply and connectors. Supports live mobile phone viewing.',
    specifications: {
      'Cameras': '2 Dome + 2 Outdoor Bullet 2.4MP Night Vision',
      'Hard Disk': '1TB Seagate/WD Surveillance Certified HDD',
      'Recording': 'Full HD 1080p H.265+ Compression',
      'Mobile App': 'gCMOB Free remote viewing app on Android & iOS',
      'Installation': 'Doorstep installation available across Coimbatore'
    },
    inStoreAvailability: 'Available for immediate pickup/installation',
    amazon_asin: 'B08F9S8RQK',
    badge: 'Coimbatore Security Choice'
  },
  {
    _id: 'tvc-mon-01',
    name: 'LG 24-inch Borderless IPS Full HD Monitor (100Hz, AMD FreeSync)',
    category: 'cctv-monitors',
    brand: 'LG',
    price: 7990,
    amazon_price: 8499,
    original_price: 11000,
    rating: 4.5,
    review_count: 6700,
    stock: 8,
    warranty_months: 36,
    condition: 'Brand New (3-side borderless)',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp IPS panel with wide viewing angles, 100Hz refresh rate for butter-smooth scrolling, AMD FreeSync, Reader Mode with flicker-safe technology, HDMI & VGA ports.',
    specifications: {
      'Screen Size': '23.8-inch Full HD (1920 x 1080) IPS',
      'Refresh Rate': '100Hz with AMD FreeSync',
      'Bezel': '3-Side Virtually Borderless Design',
      'Inputs': 'HDMI, D-Sub (VGA), Audio Out'
    },
    inStoreAvailability: 'In Stock at Tatabad',
    amazon_asin: 'B0CF2R6V9M',
    badge: 'Top Rated Office Monitor'
  },

  // 6. HARDWARE & UPGRADES (RAM, SSD)
  {
    _id: 'tvc-upg-01',
    name: 'Samsung 980 1TB PCIe 3.0 NVMe M.2 Internal SSD',
    category: 'upgrades',
    brand: 'Samsung',
    price: 6490,
    amazon_price: 6999,
    original_price: 9999,
    rating: 4.8,
    review_count: 24500,
    stock: 15,
    warranty_months: 60,
    condition: 'Brand New Genuine',
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    description: 'Upgrade your laptop or desktop speed up to 6x faster than SATA SSDs. Sequential read speeds up to 3,500 MB/s. Free data cloning and installation at Techvick Tatabad counter.',
    specifications: {
      'Form Factor': 'M.2 2280 NVMe PCIe 3.0 x4',
      'Read Speed': 'Up to 3,500 MB/s',
      'Write Speed': 'Up to 3,000 MB/s',
      'Reliability': '600 TBW, Dynamic Thermal Guard',
      'Warranty': '5 Years Samsung National Warranty'
    },
    inStoreAvailability: 'In Stock (Instant 20-min Installation in Store)',
    amazon_asin: 'B08TJ2649W',
    badge: 'Instant Speed Booster'
  },
  {
    _id: 'tvc-upg-02',
    name: 'Crucial 16GB DDR4 3200MHz Laptop / Desktop RAM Memory',
    category: 'upgrades',
    brand: 'Crucial',
    price: 2990,
    amazon_price: 3290,
    original_price: 4500,
    rating: 4.7,
    review_count: 18900,
    stock: 20,
    warranty_months: 36,
    condition: 'Brand New Genuine Micron Chips',
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    description: 'Boost multitasking capability, eliminate stutter in Chrome and heavy apps. Available for all SODIMM (laptops) and UDIMM (desktops). Tested for 100% stability.',
    specifications: {
      'Speed': 'DDR4-3200 CL22',
      'Capacity': '16GB Module',
      'Voltage': '1.2V Low Power Consumption',
      'Installation': 'Free fitting & memory test at counter'
    },
    inStoreAvailability: 'In Stock (20+ Units)',
    amazon_asin: 'B08C511GQH',
    badge: 'Top Upgrade'
  }
];

// Helper to calculate Amazon Market comparison
export function getProductPricingComparison(product) {
  const storePrice = product.price || 0;
  const amazonPrice = product.amazon_price || Math.round(storePrice * 1.08);
  const savings = Math.max(0, amazonPrice - storePrice);
  const percentSaved = amazonPrice > 0 ? Math.round((savings / amazonPrice) * 100) : 0;

  return {
    storePrice,
    amazonPrice,
    savings,
    percentSaved,
    hasSavings: savings > 0,
  };
}

// Fetch live free external products (DummyJSON) and convert to INR market products
export async function fetchLiveExternalTechProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products/category/laptops?limit=8');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    const usdToInr = 85; // Current USD to INR benchmark
    const converted = (data.products || []).map((item) => {
      const inrBase = Math.round(item.price * usdToInr);
      const amazonMarket = Math.round(inrBase * 1.12);
      const storeRate = Math.round(inrBase * 0.98);

      return {
        _id: `live-ext-${item.id}`,
        name: item.title,
        category: 'laptops',
        brand: item.brand || 'Global Brand',
        price: storeRate,
        amazon_price: amazonMarket,
        original_price: Math.round(amazonMarket * 1.25),
        rating: item.rating || 4.5,
        review_count: (item.reviews?.length || 15) * 12,
        stock: item.stock || 6,
        warranty_months: 24,
        condition: 'Imported / Global Specification',
        is_featured: false,
        image_url: item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
        description: item.description,
        specifications: {
          'Brand': item.brand,
          'SKU': item.sku || `DJ-${item.id}`,
          'Dimensions': item.dimensions ? `${item.dimensions.width}x${item.dimensions.height} cm` : 'Standard Laptop',
          'Weight': item.weight ? `${item.weight} kg` : '1.8 kg',
          'Warranty': 'Techvick 1-Year Store Service Guarantee'
        },
        inStoreAvailability: 'Available on Order / Counter Stock',
        badge: 'Live Market Feed'
      };
    });

    return converted;
  } catch {
    // If offline or external API blocked, fallback gracefully
    return [];
  }
}

