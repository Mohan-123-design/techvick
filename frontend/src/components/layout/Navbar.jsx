import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ShoppingCart, Search, Phone, ChevronDown, Clock,
  Sun, Moon, MapPin, MessageSquare, ShieldCheck, LogOut
} from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../../constants';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TechvickLogo from '../common/TechvickLogo';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const { isStoreStaff, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowCategories(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products', hasDropdown: true },
    { to: '/services', label: 'Services' },
    { to: '/book-service', label: 'Book Service' },
    { to: '/warranty', label: 'Warranty' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Announcement & Location Bar */}
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span className="topbar-item">
              <MapPin size={13} className="topbar-icon" />
              <span>46, 8th St, Tatabad, Coimbatore - 641012</span>
            </span>
            <span className="topbar-divider">|</span>
            <span className="topbar-item">
              <Clock size={13} className="topbar-icon" />
              <span>Mon - Sat: 9:30 AM – 8:30 PM</span>
            </span>
            <span className="topbar-divider hide-mobile">|</span>
            <a href={`tel:${STORE_INFO.phone}`} className="topbar-item topbar-phone-link">
              <Phone size={13} className="topbar-icon" />
              <span>{STORE_INFO.phone}</span>
            </a>
          </div>

          <div className="topbar-right">
            <a
              href={STORE_INFO.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="topbar-link"
              title="Locate Techvick Computers on Google Maps"
            >
              📍 Google Maps
            </a>
            <span className="topbar-divider">|</span>
            <a
              href={STORE_INFO.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="topbar-link whatsapp-topbar-link"
              title="Chat with Store Person on WhatsApp"
            >
              <MessageSquare size={13} />
              <span>WhatsApp Store Person</span>
            </a>
            {!isStoreStaff && (
              <>
                <span className="topbar-divider hide-tablet">|</span>
                <Link to="/login" className="topbar-link staff-login-toplink hide-tablet" title="Store Staff Portal Access">
                  <ShieldCheck size={13} />
                  <span>Store Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Responsive Navbar */}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Brand Logo with Monogram */}
          <TechvickLogo size="md" />

          {/* Desktop Navigation Links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <div
                key={link.to}
                className="nav-item"
                onMouseEnter={() => link.hasDropdown && setShowCategories(true)}
                onMouseLeave={() => link.hasDropdown && setShowCategories(false)}
              >
                <Link
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'nav-link-active' : ''} ${
                    link.highlight ? 'store-portal-pill' : ''
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} className="dropdown-caret" />}
                </Link>

                {/* Categories Dropdown */}
                {link.hasDropdown && showCategories && (
                  <div className="dropdown animate-fadeIn">
                    <div className="dropdown-grid">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          className="dropdown-item"
                        >
                          <span className="dropdown-icon">{cat.icon}</span>
                          <div>
                            <span className="dropdown-name">{cat.name}</span>
                            <span className="dropdown-desc">{cat.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Bar (Theme Switcher, Search, Cart, CTA) */}
          <div className="navbar-actions">
            {/* Theme Toggle (Dark to Light Switch) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-icon theme-toggle-btn"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
              aria-label="Toggle Color Theme"
            >
              {isDark ? <Sun size={19} className="theme-icon sun" /> : <Moon size={19} className="theme-icon moon" />}
            </button>

            {/* Product Search */}
            <Link to="/products" className="btn-icon nav-action" title="Search Products & Prices">
              <Search size={19} />
            </Link>

            {/* Cart / Quote Basket */}
            <Link to="/cart" className="btn-icon nav-action cart-badge-wrap" title="View Quote Basket">
              <ShoppingCart size={19} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Primary Action Button */}
            {isStoreStaff ? (
              <div className="staff-actions-cluster">
                <Link to="/admin" className="btn btn-primary btn-sm staff-portal-btn">
                  <ShieldCheck size={14} /> Store Portal
                </Link>
                <button onClick={logout} className="btn-icon staff-logout-btn" title="Exit Staff Session">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/book-service" className="btn btn-primary btn-sm navbar-cta">
                Book Service
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="navbar-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="mobile-menu animate-fadeIn">
            <div className="mobile-menu-inner">
              <div className="mobile-theme-row">
                <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                <button onClick={toggleTheme} className="btn-icon mobile-theme-btn">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-link ${location.pathname === link.to ? 'mobile-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mobile-categories">
                <p className="mobile-categories-title">Hardware Sales & Upgrades</p>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className="mobile-category"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mobile-cta-stack">
                <a
                  href={STORE_INFO.social.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-lg mobile-whatsapp-btn"
                >
                  <MessageSquare size={18} /> Chat with Store Person
                </a>
                <Link to="/book-service" className="btn btn-primary btn-lg">
                  Book Store Service Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
