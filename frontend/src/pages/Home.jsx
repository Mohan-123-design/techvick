import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Shield, Truck, Clock, Phone,
  ChevronLeft, ChevronRight, Wrench, Monitor, MapPin,
  CheckCircle2, Zap, Award
} from 'lucide-react';
import { CATEGORIES, SERVICES, TESTIMONIALS, WHY_CHOOSE_US, STORE_INFO } from '../constants';
import { productsApi } from '../utils/api';
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscount = (price, original) => {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  };

  return (
    <div className="home">
      {/* ============ HERO SECTION ============ */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid-pattern"></div>
        </div>
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} />
              <span>Trusted by 10,000+ Customers</span>
            </div>
            <h1>
              Your One-Stop
              <span className="hero-gradient-text"> Computer Sales</span>
              <br />& <span className="hero-gradient-text">Service</span> Partner
            </h1>
            <p className="hero-description">
              Laptops • Desktops • Servers • Printers • CCTV • Networking.
              Expert repairs, doorstep service, and genuine products at
              <strong> affordable prices</strong> with full warranty.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Browse Products
                <ArrowRight size={18} />
              </Link>
              <Link to="/book-service" className="btn btn-secondary btn-lg">
                <Wrench size={18} />
                Book a Service
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">10K+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-value">15K+</span>
                <span className="hero-stat-label">Devices Repaired</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-value">7+</span>
                <span className="hero-stat-label">Years Experience</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-floating-card hfc-1">
                <Monitor size={24} />
                <span>Laptops & PCs</span>
              </div>
              <div className="hero-floating-card hfc-2">
                <Shield size={24} />
                <span>Warranty Protection</span>
              </div>
              <div className="hero-floating-card hfc-3">
                <Truck size={24} />
                <span>Doorstep Service</span>
              </div>
              <div className="hero-floating-card hfc-4">
                <Award size={24} />
                <span>Certified Experts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>What We Offer</h2>
            <p>Quality products across every category to meet all your technology needs</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, index) => (
              <Link
                to={`/products?category=${cat.id}`}
                key={cat.id}
                className="category-card"
                style={{ '--delay': `${index * 80}ms`, '--accent': cat.color }}
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

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked deals with the best prices and warranty coverage</p>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => {
                const discount = getDiscount(product.price, product.original_price);
                return (
                  <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                    {discount && (
                      <span className="product-badge badge-success">
                        {discount}% OFF
                      </span>
                    )}
                    <div className="product-image">
                      <span className="product-image-icon">
                        {CATEGORIES.find((c) => c.id === product.category)?.icon || '📦'}
                      </span>
                    </div>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h4>{product.name}</h4>
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span>({product.review_count})</span>
                      </div>
                      <div className="product-price-row">
                        <span className="price">{formatPrice(product.price)}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="price-original">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>
                      {product.warranty_months > 0 && (
                        <div className="product-warranty">
                          <Shield size={14} />
                          <span>{product.warranty_months} months warranty</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              // Skeleton cards when loading
              [...Array(4)].map((_, i) => (
                <div key={i} className="product-card product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="product-info">
                    <div className="skeleton-line skeleton-sm"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line skeleton-md"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="section-action">
            <Link to="/products" className="btn btn-secondary btn-lg">
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SERVICES SECTION ============ */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Expert technical services at your doorstep or in-store</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((service, index) => (
              <div key={service.id} className="service-card" style={{ '--delay': `${index * 100}ms` }}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="service-footer">
                  <span className="service-price">{service.price}</span>
                  <Link to="/book-service" className="btn btn-secondary btn-sm">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose TechMart?</h2>
            <p>We're committed to delivering the best value and service experience</p>
          </div>
          <div className="why-grid">
            {WHY_CHOOSE_US.map((item, index) => (
              <div key={index} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real customers who trust us</p>
          </div>
          <div className="testimonials-carousel">
            <button
              className="carousel-btn carousel-prev"
              onClick={() =>
                setCurrentTestimonial(
                  (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                )
              }
            >
              <ChevronLeft size={24} />
            </button>
            <div className="testimonial-card animate-fadeIn" key={currentTestimonial}>
              <div className="testimonial-stars">
                {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <blockquote>"{TESTIMONIALS[currentTestimonial].text}"</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {TESTIMONIALS[currentTestimonial].avatar}
                </div>
                <div>
                  <strong>{TESTIMONIALS[currentTestimonial].name}</strong>
                  <span>{TESTIMONIALS[currentTestimonial].role}</span>
                </div>
              </div>
              <div className="testimonial-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === currentTestimonial ? 'dot-active' : ''}`}
                    onClick={() => setCurrentTestimonial(i)}
                  />
                ))}
              </div>
            </div>
            <button
              className="carousel-btn carousel-next"
              onClick={() =>
                setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
              }
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ STORE VISIT ============ */}
      <section className="section store-section">
        <div className="container">
          <div className="store-card">
            <div className="store-info">
              <h2>Visit Our Store</h2>
              <p>Experience our products hands-on at our physical store. Our experts are ready to help you choose the right technology.</p>
              <div className="store-details">
                <div className="store-detail">
                  <MapPin size={20} />
                  <div>
                    <strong>Address</strong>
                    <span>{STORE_INFO.address}, {STORE_INFO.city}</span>
                  </div>
                </div>
                <div className="store-detail">
                  <Clock size={20} />
                  <div>
                    <strong>Working Hours</strong>
                    <span>{STORE_INFO.workingHours}</span>
                    <span>{STORE_INFO.sundayHours}</span>
                  </div>
                </div>
                <div className="store-detail">
                  <Phone size={20} />
                  <div>
                    <strong>Call Us</strong>
                    <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phone}</a>
                  </div>
                </div>
              </div>
              <a
                href={STORE_INFO.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg"
              >
                <MapPin size={18} />
                Get Directions
              </a>
            </div>
            <div className="store-map-placeholder">
              <div className="store-map-inner">
                <MapPin size={48} />
                <h3>{STORE_INFO.name}</h3>
                <p>{STORE_INFO.tagline}</p>
                <span>📍 {STORE_INFO.city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
