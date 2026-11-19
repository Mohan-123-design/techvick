import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle2,
  MapPin, Truck, Shield, Package, MessageSquare, Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../utils/api';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const [fulfillmentType, setFulfillmentType] = useState('pickup'); // 'pickup' or 'delivery'
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryAddress: '',
  });

  const deliveryCharge = fulfillmentType === 'delivery' ? (cartTotal > 20000 ? 0 : 199) : 0;
  const finalTotal = cartTotal + deliveryCharge;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const generateWhatsAppUrl = () => {
    const itemsList = cart.map((i, idx) => `${idx + 1}. ${i.name} (Qty: ${i.quantity}) - ${formatPrice(i.price * i.quantity)}`).join('%0A');
    const msg = `Hi Techvick Computers, I want to inquire about these products from your store:%0A${itemsList}%0A%0AEstimated Total: ${formatPrice(finalTotal)}%0AFulfillment: ${fulfillmentType === 'pickup' ? 'In-Store Pickup (Tatabad)' : 'Doorstep Delivery in Coimbatore'}%0APlease connect with me to verify live stock and condition.`;
    return `https://wa.me/918807023322?text=${msg}`;
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerDetails.name.trim() || !customerDetails.phone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }

    if (fulfillmentType === 'delivery' && !customerDetails.deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        customer_email: customerDetails.email || '',
        items: cart.map((i) => ({
          product_id: i._id || i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        fulfillment_type: fulfillmentType,
        delivery_address: fulfillmentType === 'delivery' ? customerDetails.deliveryAddress : 'Tatabad Walk-In Counter',
        payment_method: 'Consult with Store Person (Zero Advance)',
        total_amount: finalTotal,
      };

      const result = await ordersApi.create(orderPayload);
      setPlacedOrder({
        orderId: result.order_id || 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        total: finalTotal,
        fulfillmentType,
        customer: { ...customerDetails },
      });
      clearCart();
      setCheckoutModalOpen(false);
      toast.success('Inquiry Sent to Store Person Successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        {placedOrder ? (
          /* Placed Order Confirmation */
          <div className="order-success-card animate-fadeIn">
            <div className="success-badge-icon">
              <CheckCircle2 size={54} />
            </div>
            <h1>Product Inquiry Received!</h1>
            <p className="order-sub">
              Your product selection has been shared with our Tatabad showroom staff. Our store person will contact you via Phone/WhatsApp to provide product photos, condition check, and confirm fulfillment. No advance payment required!
            </p>

            <div className="order-meta-box">
              <div>
                <span className="om-label">Inquiry Reference #</span>
                <span className="om-val">{placedOrder.orderId}</span>
              </div>
              <div>
                <span className="om-label">Fulfillment Mode</span>
                <span className="om-val">
                  {placedOrder.fulfillmentType === 'pickup'
                    ? '🏪 In-Store Inspection & Pickup'
                    : '🚚 Express Doorstep Delivery'}
                </span>
              </div>
              <div>
                <span className="om-label">Estimated Value</span>
                <span className="om-val green">{formatPrice(placedOrder.total)}</span>
              </div>
            </div>

            <div className="order-items-summary">
              <h3>Requested Products</h3>
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="oi-line">
                  <span>{it.name} (x{it.quantity})</span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="order-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <a
                href={`https://wa.me/918807023322?text=Hi%20Techvick%20Computers,%20I%20have%20inquired%20for%20order%20${placedOrder.orderId}.%20Please%20share%20details.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ background: '#25d366', borderColor: '#25d366' }}
              >
                <MessageSquare size={16} /> WhatsApp Store Person Now
              </a>
              <a href="tel:8807023322" className="btn btn-secondary">
                <Phone size={16} /> Call Store Desk
              </a>
              <Link to="/products" className="btn btn-outline">
                Continue Browsing
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State */
          <div className="empty-cart-state">
            <div className="empty-cart-icon">
              <ShoppingCart size={64} />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>
              Looking for enterprise laptops, high-speed printers, surveillance CCTV kits,
              or desktop upgrade components? Browse our catalog with direct store warranty.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Left: Cart Items List */}
            <div className="cart-items-col">
              <div className="cart-items-header">
                <h2>Your Selected Products ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h2>
                <button
                  type="button"
                  className="btn-clear-cart"
                  onClick={clearCart}
                  title="Remove all items from cart"
                >
                  <Trash2 size={15} /> Clear All
                </button>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item._id || item.id} className="cart-item-card">
                    <div className="item-visual-box">
                      <span className="item-cat-icon">
                        {item.category === 'laptops' ? '💻' : item.category === 'printers' ? '🖨️' : item.category === 'cctv' ? '📷' : '🖥️'}
                      </span>
                    </div>

                    <div className="item-info-box">
                      <div className="item-top-line">
                        <span className="item-cat-tag">{item.category}</span>
                        {item.brand && <span className="item-brand-tag">{item.brand}</span>}
                      </div>
                      <h3>{item.name}</h3>
                      <p className="item-warranty-note">
                        <Shield size={13} /> {item.warranty_months || 24} Months Store Warranty
                      </p>
                      <div className="item-price-unit">{formatPrice(item.price)} each</div>
                    </div>

                    <div className="item-controls-box">
                      <div className="qty-counter">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="item-subtotal">
                        {formatPrice(item.price * item.quantity)}
                      </div>

                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeFromCart(item._id || item.id)}
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cart Summary & Store Person Consultation */}
            <aside className="cart-summary-col">
              <div className="summary-card">
                <h3>Order & Consultation Summary</h3>

                {/* Fulfillment Selection */}
                <div className="fulfillment-toggle-group">
                  <button
                    type="button"
                    className={`ful-btn ${fulfillmentType === 'pickup' ? 'active' : ''}`}
                    onClick={() => setFulfillmentType('pickup')}
                  >
                    <MapPin size={16} />
                    <span>In-Store Pickup</span>
                    <small>Tatabad Main Counter (Free)</small>
                  </button>

                  <button
                    type="button"
                    className={`ful-btn ${fulfillmentType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setFulfillmentType('delivery')}
                  >
                    <Truck size={16} />
                    <span>Doorstep Delivery</span>
                    <small>{cartTotal > 20000 ? 'Free (Above ₹20k)' : 'Coimbatore (+₹199)'}</small>
                  </button>
                </div>

                <div className="price-breakdown">
                  <div className="pb-row">
                    <span>Products Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="pb-row">
                    <span>Fulfillment:</span>
                    <span>{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span>
                  </div>
                  <div className="pb-row">
                    <span>Payment Mode:</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Zero Advance Needed</span>
                  </div>
                  <div className="pb-total-row">
                    <span>Total Estimate:</span>
                    <span className="total-num">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Store Consultation Notice */}
                <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', margin: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <Shield size={14} /> Direct Store Person Support
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    No payment is required online. Connect with our store person to verify live stock, demo units, and check specs before paying at counter or delivery.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg checkout-btn"
                  onClick={() => setCheckoutModalOpen(true)}
                >
                  Confirm with Store Person <ArrowRight size={18} />
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-block"
                  style={{ marginTop: '0.75rem', borderColor: '#25d366', color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <MessageSquare size={16} /> WhatsApp Store Person with Cart
                </a>

                <div className="summary-perks">
                  <div className="sp-item">
                    <Shield size={16} />
                    <span>Store warranty & printed GST bill provided</span>
                  </div>
                  <div className="sp-item">
                    <CheckCircle2 size={16} />
                    <span>Pay only after inspecting device</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Checkout Modal */}
        {checkoutModalOpen && (
          <div className="modal-overlay" onClick={() => setCheckoutModalOpen(false)}>
            <div className="modal-container checkout-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Confirm Products with Store Person</h2>
              <p className="checkout-sub">
                Selected {cart.reduce((sum, i) => sum + i.quantity, 0)} items ({formatPrice(finalTotal)}). No advance payment required.
              </p>

              <form onSubmit={handleCheckoutSubmit}>
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com (optional)"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                    />
                  </div>
                </div>

                {fulfillmentType === 'delivery' && (
                  <div className="form-field">
                    <label>Complete Delivery Address *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Door / Flat number, building, street, landmark, pincode..."
                      value={customerDetails.deliveryAddress}
                      onChange={(e) =>
                        setCustomerDetails({ ...customerDetails, deliveryAddress: e.target.value })
                      }
                    ></textarea>
                  </div>
                )}

                <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', margin: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                    <CheckCircle2 size={16} /> Zero Advance Payment
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Our store person will reach out to you via WhatsApp or Call to verify the products, provide demo photos/videos, and finalize counter pickup or doorstep delivery.
                  </p>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCheckoutModalOpen(false)}
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? 'Connecting...' : 'Send to Store Person'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
