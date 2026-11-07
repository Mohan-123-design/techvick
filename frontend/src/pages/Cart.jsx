import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle2,
  MapPin, Truck, Shield, ArrowLeft, Package
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
    paymentMethod: 'counter_cod', // 'counter_cod' or 'upi'
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
        customer_email: customerDetails.email,
        items: cart.map((i) => ({
          product_id: i._id || i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        fulfillment_type: fulfillmentType,
        delivery_address: fulfillmentType === 'delivery' ? customerDetails.deliveryAddress : 'In-Store Pickup',
        payment_method: customerDetails.paymentMethod,
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
      toast.success('Order Placed Successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
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
            <h1>Order Confirmed!</h1>
            <p className="order-sub">
              Thank you for choosing Techvick Computers. Your order request has been received at our Tatabad, Gandhipuram counter.
            </p>

            <div className="order-meta-box">
              <div>
                <span className="om-label">Order Number</span>
                <span className="om-val">{placedOrder.orderId}</span>
              </div>
              <div>
                <span className="om-label">Fulfillment Mode</span>
                <span className="om-val">
                  {placedOrder.fulfillmentType === 'pickup'
                    ? '🏪 In-Store Pickup (Ready in 2h)'
                    : '🚚 Express Doorstep Delivery'}
                </span>
              </div>
              <div>
                <span className="om-label">Total Amount</span>
                <span className="om-val green">{formatPrice(placedOrder.total)}</span>
              </div>
            </div>

            <div className="order-items-summary">
              <h3>Items Ordered</h3>
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="oi-line">
                  <span>{it.name} (x{it.quantity})</span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="order-actions">
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <Link to="/book-service" className="btn btn-primary">
                Book Installation Service
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
              <Package size={18} /> Browse Hardware Catalog
            </Link>
          </div>
        ) : (
          /* Cart List & Checkout */
          <div className="cart-layout">
            <div className="cart-items-column">
              <div className="cart-header-row">
                <h2>Shopping Cart ({cart.length} items)</h2>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear All
                </button>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <div key={itemId} className="cart-item-card">
                      <div className="item-visual-box">
                        <span className="item-cat-icon">
                          {item.category === 'laptops' ? '💻' :
                           item.category === 'printers' ? '🖨️' :
                           item.category === 'cctv' ? '📷' :
                           item.category === 'desktops' ? '🖥️' :
                           item.category === 'servers' ? '🗄️' : '🖱️'}
                        </span>
                      </div>

                      <div className="item-info-box">
                        <div className="item-top-line">
                          <span className="item-brand">{item.brand}</span>
                          <span className="item-warranty">
                            <Shield size={12} /> {item.warranty_months || 24}M Warranty
                          </span>
                        </div>
                        <h4 className="item-title">{item.name}</h4>
                        <p className="item-avail">
                          <MapPin size={12} /> {item.inStoreAvailability || 'Ready in store stock'}
                        </p>

                        <div className="item-bottom-controls">
                          <div className="quantity-controls">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="item-price-wrap">
                            <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                            {item.quantity > 1 && (
                              <span className="item-unit-price">({formatPrice(item.price)} each)</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeFromCart(itemId)}
                            title="Remove from cart"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="continue-shopping-wrap">
                <Link to="/products" className="continue-link">
                  <ArrowLeft size={16} /> Add More Hardware
                </Link>
              </div>
            </div>

            {/* Cart Summary & Fulfillment */}
            <aside className="cart-summary-column">
              <div className="summary-card">
                <h3>Fulfillment & Checkout</h3>

                {/* Fulfillment Mode Toggle */}
                <div className="fulfillment-selector">
                  <label className="fulfillment-label">Choose Delivery or Store Pickup</label>
                  <div className="fulfillment-options">
                    <label
                      className={`f-option ${fulfillmentType === 'pickup' ? 'active' : ''}`}
                      onClick={() => setFulfillmentType('pickup')}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === 'pickup'}
                        onChange={() => setFulfillmentType('pickup')}
                      />
                      <MapPin size={18} className="f-icon" />
                      <div>
                        <strong>In-Store Pickup</strong>
                        <span className="f-sub">Ready in 2 Hours (FREE)</span>
                      </div>
                    </label>

                    <label
                      className={`f-option ${fulfillmentType === 'delivery' ? 'active' : ''}`}
                      onClick={() => setFulfillmentType('delivery')}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === 'delivery'}
                        onChange={() => setFulfillmentType('delivery')}
                      />
                      <Truck size={18} className="f-icon" />
                      <div>
                        <strong>Doorstep Delivery</strong>
                        <span className="f-sub">
                          {cartTotal > 20000 ? 'Free on orders > ₹20k' : 'Standard ₹199'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="pb-row">
                    <span>Hardware Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="pb-row">
                    <span>
                      {fulfillmentType === 'pickup' ? 'Store Pickup Fee:' : 'Delivery & Transit Insurance:'}
                    </span>
                    <span className={deliveryCharge === 0 ? 'free-tag' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  <div className="pb-row">
                    <span>GST (Included in price):</span>
                    <span>18% Tax Inclusive</span>
                  </div>
                  <div className="pb-total-row">
                    <span>Total Amount:</span>
                    <span className="total-num">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg checkout-btn"
                  onClick={() => setCheckoutModalOpen(true)}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div className="summary-perks">
                  <div className="sp-item">
                    <Shield size={16} />
                    <span>Store warranty & printed GST bill provided</span>
                  </div>
                  <div className="sp-item">
                    <CheckCircle2 size={16} />
                    <span>Zero cancellation penalty before dispatch</span>
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
              <h2>Complete Your Order</h2>
              <p className="checkout-sub">
                Total payable: <strong>{formatPrice(finalTotal)}</strong> via{' '}
                {fulfillmentType === 'pickup' ? 'In-Store Pickup' : 'Doorstep Delivery'}
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
                      placeholder="name@example.com"
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

                <div className="form-field">
                  <label>Payment Method</label>
                  <select
                    value={customerDetails.paymentMethod}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, paymentMethod: e.target.value })
                    }
                  >
                    <option value="counter_cod">
                      {fulfillmentType === 'pickup'
                        ? 'Pay at Store Counter (Card / Cash / UPI)'
                        : 'Cash on Delivery (COD)'}
                    </option>
                    <option value="upi">UPI on Delivery / Pickup (GPay / PhonePe / Paytm)</option>
                  </select>
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
                    {isPlacingOrder ? 'Confirming Order...' : 'Confirm & Place Order'}
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
