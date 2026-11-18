import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench, Home, Database,
  CheckCircle2, MapPin,
  Zap, Laptop, Printer, MessageSquare, Cpu,
  Network, Search, Shield, ArrowRight, Sparkles
} from 'lucide-react';
import { STORE_INFO } from '../constants';
import { servicesApi } from '../utils/api';
import BrandMarquee from '../components/common/BrandMarquee';
import './Services.css';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services', icon: Wrench },
  { id: 'hardware', label: 'Hardware & Chip-Level', icon: Laptop },
  { id: 'networking', label: 'Networking & LAN', icon: Network },
  { id: 'cctv_printers', label: 'CCTV & Printers', icon: Printer },
  { id: 'upgrades', label: 'High-Speed Upgrades', icon: Zap },
  { id: 'data_recovery', label: 'Data Recovery', icon: Database },
  { id: 'pc_builds', label: 'Custom PC Builds', icon: Cpu },
  { id: 'site_visit', label: 'Doorstep & AMC', icon: Home },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await servicesApi.getCatalog();
        setServices(res.services || []);
      } catch (err) {
        console.error('Failed to load services catalog', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Map icon name to Lucide component
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop': return <Laptop size={26} />;
      case 'Network': return <Network size={26} />;
      case 'Printer': return <Printer size={26} />;
      case 'Zap': return <Zap size={26} />;
      case 'Database': return <Database size={26} />;
      case 'Cpu': return <Cpu size={26} />;
      case 'Home': return <Home size={26} />;
      default: return <Wrench size={26} />;
    }
  };

  const filteredServices = services.filter((svc) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      svc.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      svc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div className="services-hero-content">
            <span className="services-pill">
              <Sparkles size={14} /> Specialist Hardware & Infrastructure Services
            </span>
            <h1>Enterprise & Desktop Care, Chip-Level Lab & LAN</h1>
            <p>
              Coimbatore's trusted technical lab for Laptops, Apple iMac, Motherboard Micro-Soldering,
              Cat6 Structured Cabling, Hikvision/CP PLUS CCTV, and High-Speed NVMe upgrades.
            </p>
            <div className="services-hero-actions">
              <Link to="/book-service" className="btn btn-primary btn-lg">
                <Wrench size={18} /> Book Free Diagnosis
              </Link>
              <a
                href={STORE_INFO.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-lg services-whatsapp-btn"
              >
                <MessageSquare size={18} /> WhatsApp Lab Technician
              </a>
            </div>

            {/* Trust highlights banner */}
            <div className="services-trust-strip">
              <div className="trust-pill">
                <Shield size={15} /> 100% Free Counter Inspection
              </div>
              <div className="trust-pill">
                <CheckCircle2 size={15} /> Written Store Warranty
              </div>
              <div className="trust-pill">
                <Laptop size={15} /> Genuine OEM Spares
              </div>
              <div className="trust-pill">
                <Home size={15} /> Doorstep Coimbatore Dispatch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <BrandMarquee title="Multi-Brand Service & Spares Partner for All 12 Major Hardware Brands" />

      {/* Services Grid Section */}
      <section className="section services-grid-section">
        <div className="container">
          {/* Controls: Search and Filter Chips */}
          <div className="services-controls-bar">
            <div className="services-filter-tabs">
              {CATEGORY_TABS.map((tab) => {
                const IconComponent = tab.icon;
                const count =
                  tab.id === 'all'
                    ? services.length
                    : services.filter(
                        (s) => s.category?.toLowerCase() === tab.id.toLowerCase()
                      ).length;
                return (
                  <button
                    key={tab.id}
                    className={`filter-tab-pill ${selectedCategory === tab.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(tab.id)}
                  >
                    <IconComponent size={15} />
                    <span>{tab.label}</span>
                    <span className="tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="services-search-input-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search services, repairs, issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="services-loading-state">
              <div className="loading-spinner"></div>
              <p>Loading Techvick Services Catalog...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="services-full-grid">
              {filteredServices.map((svc) => {
                const sId = svc._id || svc.id || svc.title;
                const featuresList = Array.isArray(svc.features)
                  ? svc.features
                  : typeof svc.features === 'string'
                  ? svc.features.split('\n').filter(Boolean)
                  : [];

                return (
                  <div key={sId} className="service-detail-card animate-fadeIn">
                    <div className="sd-header">
                      <div className="sd-icon">{renderIcon(svc.icon_name)}</div>
                      {svc.badge && <span className="sd-badge">{svc.badge}</span>}
                    </div>

                    <h3>{svc.title}</h3>
                    <p className="sd-desc">{svc.description}</p>

                    {/* Metadata strip: Turnaround & Written Warranty */}
                    <div className="sd-meta-row">
                      <div className="sd-meta-item">
                        <span className="sd-meta-label">Turnaround</span>
                        <strong className="sd-meta-val">{svc.turnaround || 'Same Day / 24 Hours'}</strong>
                      </div>
                      <div className="sd-meta-item">
                        <span className="sd-meta-label">Warranty Guarantee</span>
                        <strong className="sd-meta-val">{svc.repair_warranty || svc.repairWarranty || 'Written Store Guarantee'}</strong>
                      </div>
                    </div>

                    {/* Pricing notice: Blank or Transparent Assessment */}
                    <div className="sd-pricing-notice">
                      <span className="notice-dot"></span>
                      <span className="notice-text">
                        {svc.price?.trim()
                          ? svc.price
                          : 'Free Counter Diagnosis • Transparent Quote on Assessment'}
                      </span>
                    </div>

                    {/* Included Features Checklist */}
                    {featuresList.length > 0 && (
                      <div className="sd-features-list">
                        <p className="sd-features-title">What is Included:</p>
                        <ul>
                          {featuresList.map((f, idx) => (
                            <li key={idx}>
                              <CheckCircle2 size={15} className="sd-check" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="sd-card-actions">
                      <Link
                        to={`/book-service?service=${encodeURIComponent(svc.title)}`}
                        className="btn btn-primary btn-block"
                      >
                        Book This Service <ArrowRight size={15} />
                      </Link>
                      <a
                        href={`${STORE_INFO.social.whatsapp}?text=Hi%20Techvick%20Computers,%20I%20would%20like%20to%20inquire%20about%20your%20service:%20${encodeURIComponent(svc.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-block services-card-whatsapp"
                      >
                        <MessageSquare size={15} /> WhatsApp Inquiry
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="services-empty-state">
              <p>No services found matching your selection.</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Walk-in vs Doorstep Comparison Section */}
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
                Bring your device directly to our physical showroom counter. Our hardware engineer will open and inspect the device in your presence and provide an immediate assessment.
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
                className="btn btn-secondary btn-block"
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
