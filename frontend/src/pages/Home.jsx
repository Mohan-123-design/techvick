import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Shield,
  Wrench, Monitor, MapPin,
  CheckCircle2, Zap, MessageSquare, TrendingDown
} from 'lucide-react';
import { CATEGORIES, SERVICES, TESTIMONIALS, WHY_CHOOSE_US, STORE_INFO } from '../constants';
import { productsApi } from '../utils/api';
import { getProductPricingComparison } from '../utils/realMarketProducts';
import BrandMarquee from '../components/common/BrandMarquee';
import StoreShowcase from '../components/common/StoreShowcase';
import AnimatedCounter from '../components/common/AnimatedCounter';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    productsApi.getFeatured(8)
      .then((data) => setFeaturedProducts(data.products || []))
      .catch(() => setFeaturedProducts([]));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="home">
      {/* ============ HERO SECTION ============ */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-grid-pattern"></div>
        </div>

        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} />
              <span>46, 8th Street, Tatabad • Gandhipuram, Coimbatore</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-company-name">TECHVICK COMPUTERS</span>
              <br />
              <span className="hero-gradient-text">Taking Care of Your PC</span>
            </h1>

            <p className="hero-description">
              Coimbatore's trusted destination for <strong>New & Used Laptops, Desktops, Apple iMac, Printers, CCTV Surveillance</strong>,
              custom PC builds, high-speed SSD upgrades, and precision chip-level repairs.
            </p>

            <div className="hero-actions">
              <Link to="/book-service" className="btn btn-primary btn-lg">
                <Wrench size={18} />
                Book Service Appointment
              </Link>
              <a
                href={STORE_INFO.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-lg hero-whatsapp-btn"
              >
                <MessageSquare size={18} />
                WhatsApp Store Person
              </a>
              <Link to="/products" className="btn btn-outline btn-lg">
                View Market Prices <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">
                  <AnimatedCounter end={10} suffix="+" duration={1400} />
                </span>
                <span className="hero-stat-label">Years of Experience</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-value">
                  <AnimatedCounter end={15000} suffix="+" separator duration={2000} />
                </span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-value">
                  <AnimatedCounter end={12} suffix="+" duration={1200} />
                </span>
                <span className="hero-stat-label">Serviced Brands</span>
              </div>
              <div className="hero-stat-divider hide-mobile"></div>
              <div className="hero-stat hide-mobile">
                <span className="hero-stat-value">
                  <AnimatedCounter end={100} suffix="%" duration={1600} />
                </span>
                <span className="hero-stat-label">Component-Level Care</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-floating-card hfc-1">
                <Monitor size={22} />
                <div>
                  <strong>Laptops, Desktops & iMac</strong>
                  <span>New & Certified Pre-Owned</span>
                </div>
              </div>
              <div className="hero-floating-card hfc-2">
                <Shield size={22} />
                <div>
                  <strong>Direct In-Store Warranty</strong>
                  <span>Quick Tatabad Counter Support</span>
                </div>
              </div>
              <div className="hero-floating-card hfc-3">
                <Zap size={22} />
                <div>
                  <strong>SSD & RAM Upgrades</strong>
                  <span>Done in 30-45 Minutes</span>
                </div>
              </div>
              <div className="hero-floating-card hfc-4">
                <MapPin size={22} />
                <div>
                  <strong>Doorstep & Site Visit</strong>
                  <span>Coimbatore Wide Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MULTI-BRAND MARQUEE (12 BRANDS FROM CARD) ============ */}
      <BrandMarquee title="Multi-Brand Sales, Genuine Spares & Chip-Level Repairs in Coimbatore" />

      {/* ============ STORE LOCATION & REAL PHOTOS SHOWCASE ============ */}
      <StoreShowcase />

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Our Core Expertise</span>
            <h2>Hardware, Systems & Services</h2>
            <p>Select a category to explore genuine hardware, live market rates and repair options.</p>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat, index) => (
              <Link
                to={`/products?category=${cat.id}`}
                key={cat.id}
                className="category-card"
                style={{ '--delay': `${index * 60}ms`, '--accent': cat.color }}
              >
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <span className="category-arrow">
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS WITH REAL AMAZON COMPARISON ============ */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Real Market Transparency</span>
            <h2>Current Market Stock & Amazon Price Comparison</h2>
            <p>We benchmark real online retail prices so you get verified hardware with local store warranty and setup.</p>
          </div>

          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => {
                const comparison = getProductPricingComparison(product);
                return (
                  <div key={product._id || product.id} className="product-card">
                    {product.badge && (
                      <span className="product-badge badge-primary">
                        {product.badge}
                      </span>
                    )}

                    <div className="product-image-container">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="product-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="product-image-fallback">
                          <span>{CATEGORIES.find((c) => c.id === product.category)?.icon || '💻'}</span>
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <div className="product-meta-row">
                        <span className="product-brand-tag">{product.brand}</span>
                        <span className="product-stock-pill">In Store</span>
                      </div>

                      <h4 className="product-title" title={product.name}>{product.name}</h4>

                      {/* Amazon Market Price Comparison */}
                      <div className="market-compare-box">
                        <div className="compare-line amazon-line">
                          <span className="market-source">Amazon Market:</span>
                          <span className="market-price">{formatPrice(comparison.amazonPrice)}</span>
                        </div>
                        <div className="compare-line store-line">
                          <span className="store-source">Techvick Walk-In:</span>
                          <span className="store-price-val">{formatPrice(comparison.storePrice)}</span>
                        </div>
                        {comparison.hasSavings && (
                          <div className="savings-pill">
                            <TrendingDown size={12} />
                            <span>Save {formatPrice(comparison.savings)} + Free Store Setup</span>
                          </div>
                        )}
                      </div>

                      <div className="product-footer-row">
                        <span className="warranty-tag">
                          <Shield size={12} /> {product.warranty_months}M Warranty
                        </span>
                        <a
                          href={`${STORE_INFO.social.whatsapp}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-xs product-inquire-btn"
                        >
                          Inquire
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="product-card product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="product-info">
                    <div className="skeleton-line skeleton-sm"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="section-action">
            <Link to="/products" className="btn btn-secondary btn-lg">
              Explore Complete Product Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CORE SERVICES (FROM BUSINESS CARD) ============ */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Our Services</span>
            <h2>Taking Care of Your PC & Peripherals</h2>
            <p>From chip-level motherboard diagnosis to prompt doorstep servicing across Coimbatore.</p>
          </div>

          <div className="services-grid">
            {SERVICES.map((service, index) => (
              <div key={service.id} className="service-card" style={{ '--delay': `${index * 80}ms` }}>
                <div className="service-header-row">
                  <div className="service-icon">{service.icon}</div>
                  {service.badge && <span className="service-badge">{service.badge}</span>}
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="feature-check" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="service-footer">
                  <span className="service-price">{service.price}</span>
                  <Link to="/book-service" className="btn btn-secondary btn-sm">
                    Book Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE TECHVICK ============ */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Why Techvick Computers</span>
            <h2>Built on Technical Trust & Local Service</h2>
            <p>Serving Gandhipuram and the greater Coimbatore area with honest advice and certified workmanship.</p>
          </div>

          <div className="why-grid">
            {WHY_CHOOSE_US.map((item, index) => (
              <div key={index} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS SLIDER ============ */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-pill">Customer Feedback</span>
            <h2>What Our Customers in Coimbatore Say</h2>
          </div>

          <div className="testimonial-slider-wrap">
            {TESTIMONIALS.length > 0 && (
              <div className="testimonial-card active">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">"{TESTIMONIALS[currentTestimonial].text}"</p>
                <div className="testimonial-author">
                  <div className="t-avatar">{TESTIMONIALS[currentTestimonial].avatar}</div>
                  <div>
                    <strong>{TESTIMONIALS[currentTestimonial].name}</strong>
                    <span>{TESTIMONIALS[currentTestimonial].role}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="testimonial-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`dot-btn ${i === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
