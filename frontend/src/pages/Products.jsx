import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Filter, ShoppingCart, Eye, Check, X,
  Shield, Star, ArrowUpDown, ChevronRight, SlidersHorizontal, MapPin
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { productsApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(120000);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getAll({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          brand: selectedBrand === 'all' ? undefined : selectedBrand,
          search: searchQuery || undefined,
          max_price: maxPrice,
          sort: sortBy,
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery, maxPrice, sortBy]);

  const brands = ['all', ...new Set(products.map((p) => p.brand).filter(Boolean))];

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(catId === 'all' ? {} : { category: catId });
  };

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

  const getCategoryIcon = (catId) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.icon : '💻';
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <section className="products-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span>Products</span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight size={14} />
                <span className="breadcrumb-current">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>
          <div className="products-header-content">
            <h1>Computers, Peripherals & Hardware</h1>
            <p>
              Genuine hardware, custom workstations, enterprise servers, and surveillance equipment with authentic store warranty.
              <span className="no-phones-badge">Specialist Computer & IT Store (No mobile phones)</span>
            </p>
          </div>
        </div>
      </section>

      <div className="container products-layout">
        {/* Sidebar Filters */}
        <aside className="products-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <SlidersHorizontal size={18} />
              <h3>Filters</h3>
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery || maxPrice < 120000) && (
                <button
                  className="reset-btn"
                  onClick={() => {
                    handleCategoryChange('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                    setMaxPrice(120000);
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="category-list">
                <button
                  className={`category-item-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  <span>All Hardware</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-item-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <span>{cat.icon} {cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <div className="filter-label-row">
                <label className="filter-label">Max Price</label>
                <span className="price-tag">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="120000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>₹1,000</span>
                <span>₹1,20,000</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="brand-select"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* In-store benefits badge */}
            <div className="store-service-card">
              <div className="store-card-header">
                <MapPin size={16} />
                <span>Offline Store Support</span>
              </div>
              <p>Experience hands-on testing at our physical store before purchasing, or book doorstep delivery with free installation!</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Controls Bar */}
          <div className="products-controls">
            <div className="search-bar-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search laptops, printers, CCTV, RAM, routers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="sort-wrap">
              <ArrowUpDown size={16} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <span>Showing <strong>{products.length}</strong> verified products</span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products from catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search criteria, price range, or category filter.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCategoryChange('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                  setMaxPrice(120000);
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const discount = getDiscount(product.price, product.original_price);
                const pId = product._id || product.id;

                return (
                  <div key={pId} className="product-card">
                    {/* Badge */}
                    <div className="card-top-badges">
                      {product.badge && <span className="product-badge accent">{product.badge}</span>}
                      {discount && <span className="product-badge discount">{discount}% OFF</span>}
                    </div>

                    {/* Visual Icon Illustration */}
                    <div className="product-visual" onClick={() => setSelectedProduct(product)}>
                      <span className="product-category-icon">{getCategoryIcon(product.category)}</span>
                      <span className="product-brand-chip">{product.brand}</span>
                    </div>

                    <div className="product-info">
                      <div className="product-rating">
                        <Star size={14} className="star-icon" />
                        <span>{product.rating || 4.5}</span>
                        <span className="reviews">({product.review_count || 48})</span>
                      </div>

                      <h3 className="product-title" onClick={() => setSelectedProduct(product)}>
                        {product.name}
                      </h3>

                      <p className="product-short-desc">
                        {product.description?.substring(0, 85)}...
                      </p>

                      <div className="product-meta-row">
                        <span className="warranty-tag">
                          <Shield size={12} /> {product.warranty_months || 24}M Warranty
                        </span>
                        <span className="stock-tag">
                          <Check size={12} /> In Stock ({product.stock || 10})
                        </span>
                      </div>

                      <div className="product-price-section">
                        <div className="price-box">
                          <span className="current-price">{formatPrice(product.price)}</span>
                          {product.original_price && (
                            <span className="original-price">{formatPrice(product.original_price)}</span>
                          )}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedProduct(product)}
                          title="Quick View Specs"
                        >
                          <Eye size={15} /> Specs
                        </button>
                        <button
                          className="btn btn-primary btn-sm add-cart-btn"
                          onClick={() => addToCart(product, 1)}
                        >
                          <ShoppingCart size={15} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={20} />
            </button>

            <div className="modal-grid">
              <div className="modal-left">
                <div className="modal-category-display">
                  <span className="modal-cat-icon">{getCategoryIcon(selectedProduct.category)}</span>
                  <span className="modal-brand">{selectedProduct.brand}</span>
                </div>
                <div className="modal-store-perk">
                  <MapPin size={16} />
                  <span>{selectedProduct.inStoreAvailability || 'Available at TechMart Main Store'}</span>
                </div>
                <div className="warranty-box">
                  <Shield size={18} />
                  <div>
                    <strong>{selectedProduct.warranty_months || 24} Months Warranty Included</strong>
                    <p>Free coverage against manufacturing defects, repair labor & parts replacement.</p>
                  </div>
                </div>
              </div>

              <div className="modal-right">
                <span className="modal-badge">{selectedProduct.category?.toUpperCase()}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="modal-rating">
                  <Star size={16} className="star-icon" />
                  <span>{selectedProduct.rating || 4.8} / 5.0</span>
                  <span className="reviews">({selectedProduct.review_count || 120} Verified buyers)</span>
                </div>

                <div className="modal-price-row">
                  <span className="modal-current-price">{formatPrice(selectedProduct.price)}</span>
                  {selectedProduct.original_price && (
                    <span className="modal-original-price">{formatPrice(selectedProduct.original_price)}</span>
                  )}
                  {getDiscount(selectedProduct.price, selectedProduct.original_price) && (
                    <span className="modal-discount-tag">
                      Save {getDiscount(selectedProduct.price, selectedProduct.original_price)}%
                    </span>
                  )}
                </div>

                <p className="modal-description">{selectedProduct.description}</p>

                {/* Technical Specifications */}
                {selectedProduct.specifications && (
                  <div className="modal-specs">
                    <h4>Technical Specifications</h4>
                    <div className="specs-table">
                      {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                        <div key={key} className="specs-row">
                          <span className="specs-key">{key}</span>
                          <span className="specs-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <Link
                    to="/book-service"
                    className="btn btn-outline btn-lg"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Request Demo / Site Visit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
