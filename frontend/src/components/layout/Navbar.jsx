import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, Phone, ChevronDown, ShieldCheck, LogOut } from 'lucide-react';
import { STORE_INFO, CATEGORIES } from '../../constants';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAdmin, isAuthenticated, logout, switchRole } = useAuth();
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
    ...(isAdmin ? [{ to: '/admin', label: '👑 Admin Portal', highlight: true }] : []),
  ];

  return (
    <>
      {/* Top Bar with Role Switcher */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <Phone size={14} />
            <span>{STORE_INFO.phone}</span>
            <span className="topbar-divider">|</span>
            <span>{STORE_INFO.workingHours}</span>
          </div>

          <div className="topbar-right">
            {/* Role indicator & 1-click switcher */}
            {isAuthenticated ? (
              <div className="topbar-user-wrap">
                <button
                  type="button"
                  className={`topbar-role-badge ${isAdmin ? 'admin' : 'customer'}`}
                  onClick={switchRole}
                  title="Click to toggle between Admin and Customer role"
                >
                  {isAdmin ? '👑 Role: Admin (Click to switch)' : '👤 Role: Customer (Click to switch)'}
                </button>
                <span className="topbar-user-name">Hi, {user?.name?.split(' ')[0]}</span>
                <button onClick={logout} className="topbar-logout-btn" title="Sign Out">
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <div className="topbar-guest-wrap">
                <Link to="/login" className="topbar-login-link">
                  <User size={13} /> Sign In / Demo Roles
                </Link>
                <span className="topbar-divider">|</span>
                <a href={STORE_INFO.social.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp Us
                </a>
              </div>
            )}
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
                  className={`nav-link ${location.pathname === link.to ? 'nav-link-active' : ''} ${link.highlight ? 'admin-nav-link' : ''}`}
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

            {isAdmin ? (
              <Link to="/admin" className="btn btn-primary btn-sm admin-cta-btn">
                <ShieldCheck size={15} /> Dashboard
              </Link>
            ) : (
              <Link to="/book-service" className="btn btn-primary btn-sm navbar-cta">
                Book Service
              </Link>
            )}

            {!isAuthenticated ? (
              <Link to="/login" className="btn-icon nav-action" title="Account / Login">
                <User size={20} />
              </Link>
            ) : (
              <button onClick={logout} className="btn-icon nav-action" title="Logout">
                <LogOut size={18} />
              </button>
            )}
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
              {isAuthenticated && (
                <div className="mobile-user-status">
                  <span>Signed in as <strong>{user?.name}</strong></span>
                  <button onClick={switchRole} className="mobile-switch-btn">
                    Switch to {isAdmin ? 'Customer' : 'Admin'}
                  </button>
                </div>
              )}

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
                <p className="mobile-categories-title">Hardware Categories</p>
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

              {!isAuthenticated ? (
                <Link to="/login" className="btn btn-secondary btn-lg" style={{ width: '100%', marginBottom: '0.75rem' }}>
                  Sign In / Demo Roles
                </Link>
              ) : (
                <button onClick={logout} className="btn btn-outline btn-lg" style={{ width: '100%', marginBottom: '0.75rem', color: '#ef4444' }}>
                  Sign Out
                </button>
              )}

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
