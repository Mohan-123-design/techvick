import { Link } from 'react-router-dom';
import {
  Wrench, Home, Database,
  CheckCircle2, MapPin,
  Zap, Laptop, Printer, MessageSquare, Cpu
} from 'lucide-react';
import { STORE_INFO } from '../constants';
import BrandMarquee from '../components/common/BrandMarquee';
import './Services.css';

export default function Services() {
  const serviceCategories = [
    {
      title: 'New & Used Laptops, Desktops, iMac',
      icon: <Laptop size={28} />,
      badge: 'Sales & Service',
      description: 'Complete sales and repair of brand new and certified pre-owned laptops, custom desktop PCs, and Apple iMac / Mac Mini systems.',
      price: 'From ₹299 (Diagnosis/Fix)',
      turnaround: 'Same Day / 24 Hours',
      repairWarranty: 'Up to 1-Year Guarantee',
      features: [
        'Free preliminary counter inspection at Tatabad',
        'Certified motherboard & chip-level diagnostics',
        'Genuine parts for Dell, HP, Lenovo, Apple, Asus',
        'Display replacement, hinge repair, and battery change',
        'Pre-loaded genuine OS & vital drivers'
      ]
    },
    {
      title: 'Printers, CCTV & Monitors',
      icon: <Printer size={28} />,
      badge: 'Sales & Setup',
      description: 'Servicing for Epson EcoTank, HP LaserJet, Canon multifunction printers; Full HD night vision CCTV installation and IPS/Gaming monitor repair.',
      price: 'From ₹249',
      turnaround: '2 - 4 Hours',
      repairWarranty: 'Written Store Warranty',
      features: [
        'Micro-toner and ink refilling for Epson & HP',
        'Paper jam & pickup roller replacement',
        'CP PLUS & Hikvision 4/8/16-channel CCTV setup',
        'Remote mobile live viewing configuration',
        'Monitor backlight and power supply circuit repair'
      ]
    },
    {
      title: 'Hardware & Software Upgrade',
      icon: <Zap size={28} />,
      badge: 'Express 45-Mins',
      description: 'Supercharge slow computers. Crucial/Samsung NVMe SSD installations, RAM memory expansion, Windows 11 installation, and thermal repasting.',
      price: 'From ₹499 + Parts',
      turnaround: '30 - 45 Minutes',
      repairWarranty: 'Up to 5 Years SSD Warranty',
      features: [
        'High-speed PCIe Gen3/Gen4 NVMe SSD fitting',
        '100% complete data clone without losing files',
        'DDR4 / DDR5 RAM expansion up to 64GB',
        'High-conductivity thermal paste re-application',
        'Instant 5x to 10x boot speed boost'
      ]
    },
    {
      title: 'Custom PC Builds (Gaming & Workstation)',
      icon: <Cpu size={28} />,
      badge: 'Tailor-Made',
      description: 'Custom assembled PC rigs for competitive gaming, 4K video editing, AutoCAD 3D rendering, and office workstations with stress-tested components.',
      price: 'Starting ₹24,990',
      turnaround: '1 - 2 Business Days',
      repairWarranty: '3 Years Component Warranty',
      features: [
        'NVIDIA RTX 40-Series & AMD Radeon GPUs',
        'Intel Core & AMD Ryzen multi-core processors',
        'Clean aesthetics with hidden cable management',
        'AIO liquid cooling & high-airflow tempered glass cases',
        '24-Hour continuous thermal burn-in stress test'
      ]
    },
    {
      title: 'Networking & Data Recovery',
      icon: <Database size={28} />,
      badge: 'Privacy Guaranteed',
      description: 'Clean-room data extraction from clicking hard drives, formatted SSDs, dead pen drives, plus Cat6 structured LAN cabling & Wi-Fi routers.',
      price: 'From ₹799',
      turnaround: '24 - 48 Hours',
      repairWarranty: 'No Recovery, No Fee Policy',
      features: [
        'Sector-by-sector damaged disk data extraction',
        'Accidental format & deleted file restoration',
        'Office LAN switch & structured cabling layout',
        'Wi-Fi mesh coverage for homes & multi-floor offices',
        'Strict confidentiality and privacy protection'
      ]
    },
    {
      title: 'Doorstep & Site Visit Support',
      icon: <Home size={28} />,
      badge: 'Coimbatore Wide',
      description: 'Unable to bring your equipment to Tatabad? Our mobile service technician visits your home or office anywhere across Coimbatore.',
      price: 'Inspection from ₹349',
      turnaround: 'Prompt Slot Dispatch',
      repairWarranty: '90 Days Service Warranty',
      features: [
        'Qualified technician with diagnostic tools & common spares',
        'Transparent estimate before touching any part',
        'On-the-spot repair for 85% of software/hardware faults',
        'Covers Gandhipuram, RS Puram, Peelamedu, Saibaba Colony & more',
        'Zero hassle for heavy desktops and multi-device setups'
      ]
    }
  ];

  return (
    <div className="services-page">
      {/* Header */}
      <section className="services-hero">
        <div className="container">
          <div className="services-hero-content">
            <span className="services-pill">
              <Wrench size={14} /> Techvick Computers • Sales & Service
            </span>
            <h1>Hardware, Chip-Level Care & Upgrades</h1>
            <p>
              Specialist diagnostics and genuine spares for New & Used Laptops, Desktops, Apple iMac,
              Printers, CCTV, and High-Performance Custom PC Builds in Gandhipuram, Coimbatore.
            </p>
            <div className="services-hero-actions">
              <Link to="/book-service" className="btn btn-primary btn-lg">
                <Wrench size={18} /> Book Service Appointment
              </Link>
              <a
                href={STORE_INFO.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-lg services-whatsapp-btn"
              >
                <MessageSquare size={18} /> WhatsApp Store Technician
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners Marquee from Business Card */}
      <BrandMarquee title="Multi-Brand Service & Spares Partner for All 12 Major Hardware Brands" />

      {/* Main Service Cards */}
      <section className="section services-grid-section">
        <div className="container">
          <div className="services-full-grid">
            {serviceCategories.map((svc, i) => (
              <div key={i} className="service-detail-card">
                <div className="sd-header">
                  <div className="sd-icon">{svc.icon}</div>
                  <span className="sd-badge">{svc.badge}</span>
                </div>

                <h3>{svc.title}</h3>
                <p className="sd-desc">{svc.description}</p>

                <div className="sd-meta-row">
                  <div className="sd-meta-item">
                    <span className="sd-meta-label">Starting Price</span>
                    <span className="sd-meta-val price">{svc.price}</span>
                  </div>
                  <div className="sd-meta-item">
                    <span className="sd-meta-label">Turnaround</span>
                    <span className="sd-meta-val">{svc.turnaround}</span>
                  </div>
                  <div className="sd-meta-item">
                    <span className="sd-meta-label">Warranty</span>
                    <span className="sd-meta-val">{svc.repairWarranty}</span>
                  </div>
                </div>

                <div className="sd-features-list">
                  <p className="sd-features-title">What is Included:</p>
                  <ul>
                    {svc.features.map((f, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={15} className="sd-check" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sd-card-actions">
                  <Link
                    to={`/book-service?service=${encodeURIComponent(svc.title)}`}
                    className="btn btn-primary btn-block"
                  >
                    Book This Service
                  </Link>
                  <a
                    href={`${STORE_INFO.social.whatsapp}?text=Hi%20Techvick,%20I%20need%20inquiry%20regarding%20${encodeURIComponent(svc.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-block"
                  >
                    <MessageSquare size={16} /> WhatsApp Inquiry
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Walk-in vs Doorstep Comparison */}
      <section className="section service-modes-section">
        <div className="container">
          <div className="section-header">
            <span className="services-pill">Convenient Options</span>
            <h2>Two Simple Ways to Get Your PC Serviced</h2>
          </div>

          <div className="service-modes-grid">
            <div className="mode-box">
              <div className="mode-box-header">
                <MapPin size={28} className="mode-icon-pin" />
                <div>
                  <h3>1. Walk In to Tatabad Store</h3>
                  <span className="mode-sub">46, 8th Street, Tatabad, Coimbatore</span>
                </div>
              </div>
              <p>
                Bring your device directly to our physical showroom counter. Our hardware engineer will open and inspect the device in your presence and give you a free immediate diagnosis.
              </p>
              <ul className="mode-bullets">
                <li>✓ Free on-the-spot counter assessment</li>
                <li>✓ Hands-on demo of replacement displays, SSDs & RAM</li>
                <li>✓ Free two-wheeler & car parking on 8th Street</li>
              </ul>
              <a
                href={STORE_INFO.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-block"
              >
                Get Directions on Google Maps ↗
              </a>
            </div>

            <div className="mode-box highlight">
              <div className="mode-box-header">
                <Home size={28} className="mode-icon-home" />
                <div>
                  <h3>2. Book a Doorstep Site Visit</h3>
                  <span className="mode-sub">Anywhere Across Coimbatore</span>
                </div>
              </div>
              <p>
                Cannot carry your heavy desktop, multiple office computers, or CCTV DVR? Our mobile engineer visits your home, office, school, or clinic with diagnostic kits.
              </p>
              <ul className="mode-bullets">
                <li>✓ Convenient 2-hour scheduled arrival window</li>
                <li>✓ Background-checked hardware technician</li>
                <li>✓ 85% of issues resolved right at your doorstep</li>
              </ul>
              <Link to="/book-service" className="btn btn-primary btn-block">
                Schedule Doorstep Visit Online
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
