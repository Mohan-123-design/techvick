import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, Phone, ChevronDown } from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../../constants';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <Phone size={14} />
            <span>{STORE_INFO.phone}</span>
            <span className="topbar-divider">|</span>
            <span>{STORE_INFO.workingHours}</span>
          </div>
          <div className="topbar-right">
            <a href={STORE_INFO.social.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <span>TM</span>
            </div>
            <div className="logo-text">
              <span className="logo-name">{STORE_INFO.name}</span>
              <span className="logo-tagline">{STORE_INFO.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
                  className={`nav-link ${location.pathname === link.to ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} />}
                </Link>

                {/* Categories Dropdown */}
                {link.hasDropdown && showCategories && (
                  <div className="dropdown">
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

          {/* Actions */}
          <div className="navbar-actions">
            <Link to="/products" className="btn-icon nav-action" title="Search Products">
              <Search size={20} />
            </Link>
            <Link to="/cart" className="btn-icon nav-action cart-badge-wrap" title="View Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/book-service" className="btn btn-primary btn-sm navbar-cta">
              Book Service
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu animate-fadeIn">
            <div className="mobile-menu-inner">
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
                <p className="mobile-categories-title">Categories</p>
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
              <Link to="/book-service" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Book Service Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
