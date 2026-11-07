import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, Heart, Navigation, ShieldCheck, MessageSquare } from 'lucide-react';
import { STORE_INFO, CATEGORIES, SERVICES } from '../../constants';
import TechvickLogo from '../common/TechvickLogo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Quick Contact & WhatsApp Banner */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <h3>Need Computer Service, PC Build or Laptop Upgrade?</h3>
            <p>Visit our Tatabad Coimbatore store or contact our store technicians directly on WhatsApp.</p>
          </div>
          <div className="footer-cta-actions">
            <a href={`tel:${STORE_INFO.phone}`} className="btn btn-outline btn-lg footer-call-btn">
              <Phone size={18} />
              Call Counter
            </a>
            <a
              href={STORE_INFO.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-lg footer-whatsapp-btn"
            >
              <MessageSquare size={18} />
              WhatsApp Store Person
            </a>
            <Link to="/book-service" className="btn btn-primary btn-lg">
              Book Service Online
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <TechvickLogo size="md" showTagline={true} />
            <p className="footer-about">
              {STORE_INFO.description}
            </p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={16} className="f-icon" />
                <span>
                  {STORE_INFO.address}, {STORE_INFO.city} - {STORE_INFO.pincode}
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} className="f-icon" />
                <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phone}</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} className="f-icon" />
                <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a>
              </div>
              <div className="footer-contact-item">
                <Clock size={16} className="f-icon" />
                <span>{STORE_INFO.workingHours}</span>
              </div>
              <div className="footer-contact-item">
                <Navigation size={16} className="f-icon" />
                <a href={STORE_INFO.mapUrl} target="_blank" rel="noreferrer" className="footer-map-link">
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Hardware Categories */}
          <div className="footer-col">
            <h4>Sales & Hardware</h4>
            <ul>
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.id}`}>
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div className="footer-col">
            <h4>Store Services</h4>
            <ul>
              {SERVICES.map((svc) => (
                <li key={svc.id}>
                  <Link to="/services">{svc.icon} {svc.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Brand Logos */}
          <div className="footer-col">
            <h4>Store Links</h4>
            <ul>
              <li><Link to="/products">Live Market Prices & Stock</Link></li>
              <li><Link to="/book-service">Book Service (Doorstep/Store)</Link></li>
              <li><Link to="/warranty">Check Repair Warranty</Link></li>
              <li><Link to="/about">About Techvick Computers</Link></li>
              <li><Link to="/contact">Contact Store Desk</Link></li>
            </ul>
            <div className="footer-hours">
              <h4>Store Location</h4>
              <p className="f-muted">46, 8th Street, Tatabad, Gandhipuram, Coimbatore - 641012</p>
              <p className="f-hours-badge">Mon - Sat: 9:30 AM - 8:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Discreet Store Staff Portal Access */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved. • Taking Care of Your PC
          </p>

          <div className="footer-bottom-right">
            <span className="footer-made">
              Coimbatore's Trusted IT Specialists <Heart size={13} fill="var(--danger-500)" color="var(--danger-500)" />
            </span>
            <span className="footer-divider">|</span>
            <Link to="/store-portal" className="store-staff-discrete-link" title="Store Management Portal">
              <ShieldCheck size={14} /> Store Staff Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
