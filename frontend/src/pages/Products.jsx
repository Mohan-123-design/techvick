import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Filter, ShoppingCart, Eye, X,
  ArrowUpDown, ChevronRight, MapPin,
  RefreshCw, TrendingDown, MessageSquare
} from 'lucide-react';
import { CATEGORIES, STORE_INFO } from '../constants';
import { productsApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import { getProductPricingComparison, fetchLiveExternalTechProducts } from '../utils/realMarketProducts';
import toast from 'react-hot-toast';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(150000);
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

  const handleSyncLiveMarket = async () => {
    setIsSyncing(true);
    toast('Syncing with live Amazon & market catalogs...', { icon: '🔄' });
    try {
      const liveItems = await fetchLiveExternalTechProducts();
      if (liveItems && liveItems.length > 0) {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id || p.id));
          const newUnique = liveItems.filter((item) => !existingIds.has(item._id));
          return [...prev, ...newUnique];
        });
        toast.success(`Synced ${liveItems.length} live market products with INR pricing!`);
      } else {
        toast.success('Market catalog is up-to-date with current Amazon benchmarks.');
      }
    } catch {
      toast.success('Local market benchmarks active.');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <section className="products-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span>Products & Market Rates</span>
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
            <span className="products-pill">Real Market Transparency</span>
            <h1>Hardware, PCs & Live Market Benchmarks</h1>
            <p>
              Compare verified in-store rates with current Amazon India retail prices.
              All purchases include physical counter support, free initial setup, and written store warranty at Tatabad, Coimbatore.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="container products-layout">
        {/* Left Sidebar Filter */}
        <aside className="products-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <span className="filter-title">
                <Filter size={18} /> Filters
              </span>
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
                <button
                  className="filter-reset-btn"
                  onClick={() => {
                    handleCategoryChange('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                    setMaxPrice(150000);
                  }}
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="filter-group">
              <label className="filter-label">Categories</label>
              <div className="category-filter-list">
                <button
                  type="button"
                  className={`cat-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  <span>All Hardware & Systems</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    className={`cat-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
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
                min="2000"
                max="150000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>₹2,000</span>
                <span>₹1,50,000</span>
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

            {/* Walk-in store benefit */}
            <div className="store-service-card">
              <div className="store-card-header">
                <MapPin size={16} />
                <span>Tatabad Walk-In Benefit</span>
              </div>
              <p>Test laptops hands-on at 46, 8th Street, Tatabad before purchasing. Free memory tests and SSD speed benchmarks on site.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="products-main">
          {/* Controls Bar */}
          <div className="products-controls">
            <div className="search-bar-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search laptops, iMac, printers, CCTV, RAM, SSD..."
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

            <div className="controls-right-cluster">
              <button
                type="button"
                onClick={handleSyncLiveMarket}
                className={`btn btn-outline btn-sm sync-market-btn ${isSyncing ? 'syncing' : ''}`}
                title="Fetch live market pricing and external feeds"
                disabled={isSyncing}
              >
                <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Market Prices'}</span>
              </button>

              <div className="sort-wrap">
                <ArrowUpDown size={15} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="results-count-bar">
            <span>Showing <strong>{products.length}</strong> products with live market pricing</span>
            <span className="location-context-tag">📍 Techvick Computers, Gandhipuram</span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading real market products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products matched your criteria</h3>
              <p>Try clearing filters or search terms.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCategoryChange('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                  setMaxPrice(150000);
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const comparison = getProductPricingComparison(product);
                return (
                  <div key={product._id || product.id} className="product-card">
                    {product.badge && (
                      <span className="product-badge badge-primary">
                        {product.badge}
                      </span>
                    )}

                    <div className="product-image-container" onClick={() => setSelectedProduct(product)}>
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
                      <div className="image-hover-action">
                        <Eye size={16} /> Quick View Details
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-meta-row">
                        <span className="product-brand-tag">{product.brand}</span>
                        {product.condition && (
                          <span className="condition-tag">{product.condition}</span>
                        )}
                      </div>

                      <h4
                        className="product-title"
                        title={product.name}
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.name}
                      </h4>

                      {/* Amazon Market Price Comparison Box */}
                      <div className="market-compare-box">
                        <div className="compare-line amazon-line">
                          <span className="market-source">Amazon Rate:</span>
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

                      <div className="product-bottom-row">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm add-cart-btn"
                          onClick={() => addToCart(product)}
                          title="Add to Quote Basket"
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                        <a
                          href={`${STORE_INFO.social.whatsapp}?text=Hi%20Techvick,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(Listed%20at%20${formatPrice(comparison.storePrice)})`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm product-whatsapp-btn"
                        >
                          <MessageSquare size={14} /> Inquire
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Product Specification Modal */}
      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-card animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              ✕
            </button>

            <div className="modal-grid">
              <div className="modal-img-col">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="modal-img" />
                ) : (
                  <div className="modal-img-fallback">💻</div>
                )}
                {selectedProduct.inStoreAvailability && (
                  <div className="in-store-notice">
                    <MapPin size={14} />
                    <span>{selectedProduct.inStoreAvailability}</span>
                  </div>
                )}
              </div>

              <div className="modal-details-col">
                <span className="modal-brand">{selectedProduct.brand}</span>
                <h2>{selectedProduct.name}</h2>

                {/* Price Display */}
                <div className="modal-price-box">
                  <div>
                    <span className="modal-price-label">Techvick Special Price:</span>
                    <span className="modal-price-val">{formatPrice(selectedProduct.price)}</span>
                  </div>
                  {selectedProduct.amazon_price && (
                    <div className="modal-amazon-compare">
                      <span>Amazon Benchmark: {formatPrice(selectedProduct.amazon_price)}</span>
                    </div>
                  )}
                </div>

                <p className="modal-description">{selectedProduct.description}</p>

                {/* Detailed Specs */}
                {selectedProduct.specifications && (
                  <div className="modal-specs-wrap">
                    <h4>Technical Specifications</h4>
                    <div className="specs-table">
                      {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                        <div key={key} className="spec-row">
                          <span className="spec-key">{key}</span>
                          <span className="spec-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions-bar">
                  <button
                    className="btn btn-outline btn-lg"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Quote Basket
                  </button>
                  <a
                    href={`${STORE_INFO.social.whatsapp}?text=Hi%20Techvick,%20I%20want%20to%20order/inquire%20about%20${encodeURIComponent(selectedProduct.name)}%20at%20${formatPrice(selectedProduct.price)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-lg modal-whatsapp-btn"
                  >
                    <MessageSquare size={18} /> WhatsApp Store Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
