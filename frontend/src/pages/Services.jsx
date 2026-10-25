import { Link } from 'react-router-dom';
import {
  Wrench, Shield, Home, Settings, Database, Globe,
  CheckCircle2, Clock, MapPin, Phone, ArrowRight, Star,
  Award, Zap, DollarSign, Laptop, Printer, Video
} from 'lucide-react';
import { SERVICES, STORE_INFO } from '../constants';
import './Services.css';

export default function Services() {
  const serviceCategories = [
    {
      title: 'Laptop & Desktop Chip-Level Care',
      icon: <Laptop size={28} />,
      badge: 'Most Popular',
      description: 'Specialist motherboard diagnosis, broken screen/hinge repair, SSD/RAM speed upgrades, overheating fan cleaning, and OS recovery.',
      price: 'From ₹299',
      turnaround: 'Same Day / 24 Hours',
      repairWarranty: '90 Days Guarantee',
      features: [
        'Free preliminary diagnostic check',
        'Genuine original replacement spares',
        'Liquid spill ultrasonic cleaning',
        'Thermal paste re-application (Noctua/Arctic)',
        'Data privacy strictly protected'
      ]
    },
    {
      title: 'Printer & Plotter Maintenance',
      icon: <Printer size={28} />,
      badge: 'Low Cost Refills',
      description: 'Toner refilling, print-head deep cleaning, paper feed roller replacement, logic board repair for Epson, HP, Canon & Brother printers.',
      price: 'From ₹199',
      turnaround: '2 - 4 Hours',
      repairWarranty: '60 Days Guarantee',
      features: [
        'High-density micro toner ink refills',
        'Paper pickup roller replacement',
        'Wi-Fi network printer sharing setup',
        'Waste ink pad reset & sponge change',
        'Free test print calibration'
      ]
    },
    {
      title: 'CCTV & Security Surveillance',
      icon: <Video size={28} />,
      badge: 'Free Site Survey',
      description: 'Complete end-to-end installation of CP Plus & Hikvision IP cameras, DVR/NVR setup, mobile live viewing configuration, and lens repairs.',
      price: 'From ₹499/camera',
      turnaround: 'Same Day Deployment',
      repairWarranty: '1 Year On-Site Support',
      features: [
        'Night-vision & color surveillance',
        'Concealed PVC pipe cabling',
        'Remote mobile phone viewing setup',
        'Hard drive backup & cloud recording',
        'AMC maintenance for offices & societies'
      ]
    },
    {
      title: 'Site Visit / Doorstep Technician Service',
      icon: <Home size={28} />,
      badge: 'Zero Commute For You',
      description: 'Can’t bring your bulky desktop or office network to our store? Our certified technician travels directly to your home or commercial facility!',
      price: 'Inspection from ₹349',
      turnaround: 'Within 2 Hours Slot',
      repairWarranty: '90 Days Service Warranty',
      features: [
        'Verified & ID-card background checked engineers',
        'Fully equipped toolkit & emergency spare parts',
        'On-the-spot resolution for 85% of issues',
        'Transparent quote before any repair starts',
        'Covering all local pincodes & suburbs'
      ]
    },
    {
      title: 'Data Recovery & Storage Migration',
      icon: <Database size={28} />,
      badge: 'No Data, No Charge',
      description: 'Advanced data retrieval from dead hard drives, clicking HDDs, formatted SSDs, ransomware attacks, and corrupted flash drives.',
      price: 'From ₹999',
      turnaround: '24 - 48 Hours',
      repairWarranty: '100% Confidentiality',
      features: [
        'Cleanroom diagnostic inspection',
        'RAW filesystem recovery',
        'Deleted partition restoration',
        'Encrypted transfer to your new backup drive',
        'Strict confidentiality agreement (NDA)'
      ]
    },
    {
      title: 'Corporate Networking & Annual AMC',
      icon: <Globe size={28} />,
      badge: 'Business Essential',
      description: 'Structured Cat6/Fiber cabling, Cisco/TP-Link switch setup, firewall security, Wi-Fi 6 coverage, and comprehensive annual AMC contracts.',
      price: 'Custom / From ₹2,499',
      turnaround: 'Dedicated SLA',
      repairWarranty: 'Full Year Coverage',
      features: [
        'Scheduled monthly preventive visits',
        'Priority standby backup units during repair',
        'Server health monitoring & OS patch updates',
        'Rack management & cable tagging',
        'Dedicated corporate relationship manager'
      ]
    }
  ];

  return (
    <div className="services-page">
      {/* Services Hero */}
      <section className="services-hero">
        <div className="container">
          <div className="services-hero-content">
            <span className="services-pill">
              <Zap size={14} /> Certified IT & Hardware Engineers
            </span>
            <h1>Affordable Computer, Printer & Security Services</h1>
            <p>
              Whether you drop off at our offline showroom or book an urgent doorstep technician visit,
              we deliver transparent pricing, guaranteed genuine components, and 90-day service warranties.
            </p>
            <div className="hero-cta-group">
              <Link to="/book-service" className="btn btn-primary btn-lg">
                <Home size={18} /> Book a Doorstep Site Visit
              </Link>
              <a href={`tel:${STORE_INFO.phone}`} className="btn btn-secondary btn-lg">
                <Phone size={18} /> Call Technician: {STORE_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="services-pillars">
        <div className="container">
          <div className="pillars-grid">
            <div className="pillar-item">
              <div className="pillar-icon green">
                <DollarSign size={24} />
              </div>
              <div>
                <h4>Lowest Price Guarantee</h4>
                <p>Transparent itemized estimate before work begins. No hidden inspection fees if repaired.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon blue">
                <Shield size={24} />
              </div>
              <div>
                <h4>90-Day Repair Warranty</h4>
                <p>If the same issue reoccurs within 90 days, we fix it 100% free of cost.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon amber">
                <MapPin size={24} />
              </div>
              <div>
                <h4>Store Walk-in + Site Visit</h4>
                <p>Visit our offline experience center or relax at home while our mobile technician arrives.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon purple">
                <Award size={24} />
              </div>
              <div>
                <h4>No Phones, Pure IT Focus</h4>
                <p>We are dedicated computer, printer & surveillance specialists with precision tools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services Grid */}
      <section className="section services-catalog">
        <div className="container">
          <div className="section-header">
            <h2>Our Full Range of IT Solutions</h2>
            <p>Explore our transparent service catalog with upfront pricing and warranties</p>
          </div>

          <div className="services-cards-grid">
            {serviceCategories.map((srv, idx) => (
              <div key={idx} className="service-card-deep">
                <div className="service-card-top">
                  <div className="srv-icon-bubble">{srv.icon}</div>
                  <span className="srv-badge">{srv.badge}</span>
                </div>

                <h3>{srv.title}</h3>
                <p className="srv-desc">{srv.description}</p>

                <div className="srv-highlight-row">
                  <div className="srv-stat">
                    <span className="stat-label">Starting Price</span>
                    <span className="stat-val accent">{srv.price}</span>
                  </div>
                  <div className="srv-stat">
                    <span className="stat-label">Turnaround</span>
                    <span className="stat-val">{srv.turnaround}</span>
                  </div>
                  <div className="srv-stat">
                    <span className="stat-label">Warranty</span>
                    <span className="stat-val green">{srv.repairWarranty}</span>
                  </div>
                </div>

                <div className="srv-features-list">
                  {srv.features.map((feat, fIdx) => (
                    <div key={fIdx} className="srv-feature">
                      <CheckCircle2 size={16} className="feat-check" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="srv-action-row">
                  <Link to={`/book-service?service=${encodeURIComponent(srv.title)}`} className="btn btn-primary btn-block">
                    Book Service Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: In-Store vs Doorstep Site Visit */}
      <section className="section comparison-section">
        <div className="container">
          <div className="section-header">
            <h2>Choose How You Want Your Service</h2>
            <p>Both options include our hallmark 90-day warranty and certified genuine components</p>
          </div>

          <div className="comparison-cards">
            {/* Walk-in */}
            <div className="comp-card">
              <div className="comp-header">
                <MapPin size={32} className="comp-icon" />
                <h3>Offline Store Walk-in</h3>
                <span className="comp-sub">Visit our Service Showroom</span>
              </div>
              <ul className="comp-benefits">
                <li><CheckCircle2 size={18} /> Immediate counter diagnostic inspection</li>
                <li><CheckCircle2 size={18} /> Browse laptops, components & accessories while you wait</li>
                <li><CheckCircle2 size={18} /> Clean room environment for complex BGA chip repairs</li>
                <li><CheckCircle2 size={18} /> Instant billing & printed GST invoice</li>
                <li><CheckCircle2 size={18} /> Zero doorstep convenience charge</li>
              </ul>
              <div className="comp-footer">
                <p className="comp-timing">Working: {STORE_INFO.workingHours}</p>
                <Link to="/contact" className="btn btn-secondary btn-block">
                  View Store Location & Map
                </Link>
              </div>
            </div>

            {/* Site Visit */}
            <div className="comp-card featured">
              <div className="comp-popular-tag">Most Convenient</div>
              <div className="comp-header">
                <Home size={32} className="comp-icon accent" />
                <h3>Doorstep Site Visit</h3>
                <span className="comp-sub">Technician Dispatched to Your Door</span>
              </div>
              <ul className="comp-benefits">
                <li><CheckCircle2 size={18} /> Perfect for heavy desktops, CCTV setups & office networks</li>
                <li><CheckCircle2 size={18} /> 2-hour emergency dispatch slot available</li>
                <li><CheckCircle2 size={18} /> Repaired right in front of your eyes for maximum privacy</li>
                <li><CheckCircle2 size={18} /> Full testing in your real home/office network environment</li>
                <li><CheckCircle2 size={18} /> Free pickup & drop if chip-level rework is required</li>
              </ul>
              <div className="comp-footer">
                <p className="comp-timing">Slots: 10:00 AM - 7:30 PM (All 7 Days)</p>
                <Link to="/book-service" className="btn btn-primary btn-block">
                  Schedule Site Visit Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Banner */}
      <section className="services-faq-cta">
        <div className="container">
          <div className="faq-box">
            <div>
              <h3>Have an emergency hardware breakdown or need bulk AMC?</h3>
              <p>Call our direct technician helpline for instant telephone guidance or corporate inquiries.</p>
            </div>
            <div className="faq-actions">
              <a href={`tel:${STORE_INFO.phone}`} className="btn btn-primary btn-lg">
                <Phone size={18} /> {STORE_INFO.phone}
              </a>
              <a href={STORE_INFO.social.whatsapp} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
