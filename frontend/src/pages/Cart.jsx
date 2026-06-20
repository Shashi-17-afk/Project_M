import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder, createRazorpayOrder, verifyRazorpayPayment } from '../api';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay (Card/UPI/NetBanking)', icon: 'bi-credit-card' },
  { id: 'credit-card', label: 'Credit / Debit Card (Stripe Mock)', icon: 'bi-credit-card-2-front' },
  { id: 'paypal', label: 'PayPal', icon: 'bi-paypal' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'bi-cash-stack' },
];

export default function Cart() {
  const { user } = useAuth();
  const { cart, cartLoading, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [payMethod, setPayMethod] = useState('razorpay');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', cardNum: '', expiry: '', cvv: '' });

  const shipping = cartTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + shipping + tax;
  const fmt = (n) => `$${Number(n).toFixed(2)}`;

  const handleOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const items = cart.map(i => ({
      productId: i.productId,
      name: i.product?.name,
      price: i.product?.price,
      quantity: i.quantity,
      image: i.product?.image,
    }));
    const shippingAddress = { name: form.name, address: form.address };

    if (payMethod === 'razorpay') {
      // Guard: ensure the Razorpay script loaded successfully
      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection and refresh the page.');
        setProcessing(false);
        return;
      }

      try {
        // Convert total (treated as INR for Razorpay test mode) to paise.
        // Minimum is 100 paise (₹1). We use Math.max to guard against tiny amounts.
        const amountInPaise = Math.max(100, Math.round(total * 100));

        const { data: orderData } = await createRazorpayOrder({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        });

        // RAZORPAY_KEY_ID is a PUBLIC key — safe to use in frontend.
        // We use the env var first; fall back to the literal key if Vite
        // did not hot-reload the .env file after it was created.
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T3q0c8BnBi7MVt';

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'TechVault',
          description: 'E-commerce Purchase',
          order_id: orderData.order_id,
          handler: async function (response) {
            setProcessing(true);
            try {
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  items,
                  total,
                  shippingAddress
                }
              });

              if (verifyRes.data && verifyRes.data.success) {
                setLastOrder(verifyRes.data.order);
                setShowModal(false);
                setShowSuccess(true);
                clearCart();
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (err) {
              console.error('Error during signature verification:', err);
              alert(err.response?.data?.message || 'Payment verification failed. Please contact support.');
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: form.name || user.username || '',
            email: user.email || '',
          },
          theme: {
            color: '#4f46e5'
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Razorpay payment.failed event:', response.error);
          alert(`Payment failed: ${response.error.description || 'Unknown error'}. Please try again.`);
          setProcessing(false);
        });

        rzp.open();
      } catch (err) {
        console.error('Razorpay initialization failed:', err);
        alert(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
        setProcessing(false);
      }
    } else {
      try {
        const { data } = await placeOrder({
          items, total, paymentMethod: payMethod,
          shippingAddress,
        });
        setLastOrder(data);
        setShowModal(false);
        setShowSuccess(true);
      } catch {
        alert('Failed to place order. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };

  /* --- Not logged in --- */
  if (!user) return (
    <div className="empty-cart-page">
      <div className="empty-cart-card">
        <i className="bi bi-bag-x"></i>
        <h2>Sign in to view your cart</h2>
        <p>Log in to see saved items and place orders.</p>
        <Link to="/" className="btn-start-shopping">
          <i className="bi bi-house"></i> Go Home
        </Link>
      </div>
    </div>
  );

  /* --- Loading --- */
  if (cartLoading) return (
    <div className="page-loader" style={{ background: 'var(--bg-primary)', minHeight: '70vh' }}>
      <div className="spinner-border" role="status"></div>
      <span>Loading cart…</span>
    </div>
  );

  /* --- Empty cart --- */
  if (cart.length === 0 && !showSuccess) return (
    <div className="empty-cart-page">
      <div className="empty-cart-card">
        <i className="bi bi-bag"></i>
        <h2>Your cart is empty</h2>
        <p>Browse our products and add something you love.</p>
        <Link to="/products" className="btn-start-shopping">
          <i className="bi bi-grid"></i> Start Shopping
        </Link>
      </div>
    </div>
  );

  /* --- Order success --- */
  if (showSuccess && lastOrder) return (
    <div className="order-success-wrap">
      <div className="order-success-card">
        <i className="bi bi-patch-check-fill success-icon-wrap"></i>
        <h2>Order Confirmed!</h2>
        <p className="success-detail">Order ID: <strong>{lastOrder.id}</strong></p>
        <p className="success-detail">Total: <strong>{fmt(lastOrder.total)}</strong></p>
        <p className="success-detail">Payment: <strong>{lastOrder.paymentMethod}</strong></p>
        <div className="success-email-note">
          <i className="bi bi-envelope-check"></i>
          Order details saved to your account.
        </div>
        <div className="success-actions">
          <button className="btn-success-primary" onClick={() => navigate('/products')}>
            <i className="bi bi-shop me-1"></i> Continue Shopping
          </button>
          <button className="btn-success-secondary" onClick={() => navigate('/orders')}>
            <i className="bi bi-box-seam me-1"></i> My Orders
          </button>
        </div>
      </div>
    </div>
  );

  /* --- Cart --- */
  return (
    <div className="cart-page">
      <div className="cart-page-inner">
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-section">
            <div className="cart-section-head">
              <h2>Shopping Cart</h2>
              <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.productId} className="cart-item">
                  <img src={item.product?.image} alt={item.product?.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <Link to={`/products/${item.productId}`} className="cart-item-name" style={{ textDecoration: 'none' }}>
                      {item.product?.name}
                    </Link>
                    <span className="cart-item-price">{fmt(item.product?.price)}</span>
                    <span className="cart-item-stock">
                      <i className="bi bi-check-circle-fill text-success me-1"></i>In Stock
                    </span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => item.quantity > 1
                          ? updateQuantity(item.productId, item.quantity - 1)
                          : removeItem(item.productId)}
                        aria-label="Decrease quantity"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <button className="btn-remove" onClick={() => removeItem(item.productId)}>
                      <i className="bi bi-trash3"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '0 1rem 1rem' }}>
                <button
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="bi bi-trash"></i> Clear entire cart
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="order-summary-sticky">
            <div className="order-summary-card">
              <div className="summary-head"><h3>Order Summary</h3></div>
              <div className="summary-body">
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{fmt(cartTotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#16a34a' : undefined }}>
                    {shipping === 0 ? 'FREE' : fmt(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="summary-row free-ship">
                    <span>Add {fmt(SHIPPING_THRESHOLD - cartTotal)} more for free shipping</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>{fmt(tax)}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-total">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>
              <div className="summary-footer">
                <button className="btn-checkout" onClick={() => setShowModal(true)}>
                  <i className="bi bi-lock me-2"></i>Proceed to Checkout
                </button>

                <div className="payment-methods-block">
                  <p className="payment-label">Payment method</p>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className="pay-option">
                      <input
                        type="radio"
                        name="payMethod"
                        value={m.id}
                        checked={payMethod === m.id}
                        onChange={() => setPayMethod(m.id)}
                      />
                      <i className={`bi ${m.icon}`}></i>
                      {m.label}
                    </label>
                  ))}
                </div>

                <div className="security-note">
                  <i className="bi bi-shield-lock-fill"></i>
                  Secured with 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div
          className="pay-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="pay-modal">
            <div className="pay-modal-head">
              <h3><i className="bi bi-bag-check me-2"></i>Complete Your Order</h3>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="pay-modal-body">
              <form onSubmit={handleOrder}>
                <div className="pay-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="pay-form-group">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="123 Main Street, City, State"
                  />
                </div>

                {payMethod === 'credit-card' && (
                  <>
                    <div className="pay-form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        value={form.cardNum}
                        onChange={e => setForm(f => ({ ...f, cardNum: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="pay-form-row">
                      <div className="pay-form-group">
                        <label>Expiry *</label>
                        <input
                          type="text"
                          value={form.expiry}
                          onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="pay-form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          value={form.cvv}
                          onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {payMethod === 'razorpay' && (
                  <div className="pay-info-block">
                    <i className="bi bi-credit-card" style={{ color: '#4f46e5' }}></i>
                    <p>Secure payment via Razorpay. You can pay using Cards, UPI, NetBanking, or Wallets.</p>
                  </div>
                )}

                {payMethod === 'paypal' && (
                  <div className="pay-info-block">
                    <i className="bi bi-paypal" style={{ color: '#003087' }}></i>
                    <p>You will be redirected to PayPal to complete payment.</p>
                  </div>
                )}

                {payMethod === 'cod' && (
                  <div className="pay-info-block">
                    <i className="bi bi-cash-stack" style={{ color: '#16a34a' }}></i>
                    <p>Pay in cash when your order arrives at your door.</p>
                  </div>
                )}

                <div className="order-total-preview">
                  <span>Order Total</span>
                  <span>{fmt(total)}</span>
                </div>

                <button type="submit" className="btn-confirm-order" disabled={processing}>
                  {processing ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing…</>
                  ) : (
                    <><i className="bi bi-bag-check me-2"></i>Place Order — {fmt(total)}</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
