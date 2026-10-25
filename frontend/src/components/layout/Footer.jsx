import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, Heart } from 'lucide-react';
import { STORE_INFO, CATEGORIES, SERVICES } from '../../constants';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* CTA Band */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <h3>Need Help with Your Device?</h3>
            <p>Get expert service at affordable prices. We're just a call away!</p>
          </div>
          <div className="footer-cta-actions">
            <a href={`tel:${STORE_INFO.phone}`} className="btn btn-primary btn-lg">
              <Phone size={18} />
              Call Now
            </a>
            <Link to="/book-service" className="btn btn-secondary btn-lg">
              Book Service
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* About */}
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon"><span>TM</span></div>
              <div>
                <span className="logo-name">{STORE_INFO.name}</span>
                <span className="logo-tagline">{STORE_INFO.tagline}</span>
              </div>
            </div>
            <p className="footer-about">
              Your trusted partner for electronics sales and service.
              We offer quality products, expert repairs, and doorstep service
              at affordable prices.
            </p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={16} />
                <span>{STORE_INFO.address}, {STORE_INFO.city}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} />
                <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phone}</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} />
                <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a>
              </div>
              <div className="footer-contact-item">
                <Clock size={16} />
                <span>{STORE_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.id}`}>
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {SERVICES.slice(0, 6).map((svc) => (
                <li key={svc.id}>
                  <Link to="/services">{svc.icon} {svc.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/warranty">Warranty Info</Link></li>
              <li><Link to="/book-service">Book a Service</Link></li>
              <li><Link to="/products">All Products</Link></li>
            </ul>
            <div className="footer-hours">
              <h4>Store Hours</h4>
              <p>{STORE_INFO.workingHours}</p>
              <p>{STORE_INFO.sundayHours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
          </p>
          <p className="footer-made">
            Made with <Heart size={14} fill="var(--danger-500)" color="var(--danger-500)" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
