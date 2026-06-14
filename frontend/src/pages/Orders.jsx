import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../api';

const STATUS_STYLE = {
  Processing: { bg: 'rgba(245,158,11,0.12)', color: '#d97706', border: 'rgba(245,158,11,0.3)' },
  Shipped:    { bg: 'rgba(59,130,246,0.12)', color: '#2563eb', border: 'rgba(59,130,246,0.3)' },
  Delivered:  { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a', border: 'rgba(34,197,94,0.3)'  },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',  color: '#dc2626', border: 'rgba(239,68,68,0.3)'  },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  const fmt = (n) => `$${Number(n).toFixed(2)}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const toggle = (id) => setExpanded(e => e === id ? null : id);

  if (!user) return (
    <div className="orders-page">
      <div className="orders-page-inner">
        <div className="no-orders">
          <i className="bi bi-person-lock"></i>
          <h3>Please log in to view your orders</h3>
          <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="orders-page-inner">
        <h1 className="page-title">
          <i className="bi bi-box-seam"></i> My Orders
        </h1>

        {loading ? (
          <div className="page-loader">
            <div className="spinner-border" role="status"></div>
            <span>Loading orders…</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <i className="bi bi-inbox"></i>
            <h3>No orders yet</h3>
            <p>You haven&apos;t placed any orders. Browse our products and start shopping!</p>
            <Link to="/products" className="btn btn-primary mt-2">
              <i className="bi bi-grid me-2"></i>Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const style = STATUS_STYLE[order.status] || STATUS_STYLE.Processing;
              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header" onClick={() => toggle(order.id)}>
                    <div className="order-header-left">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{fmtDate(order.createdAt)}</span>
                    </div>
                    <div className="order-header-right">
                      <span
                        className="status-pill"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                      >
                        <i className="bi bi-circle-fill" style={{ fontSize: '6px' }}></i>
                        {order.status}
                      </span>
                      <span className="order-amount">{fmt(order.total)}</span>
                      <i className={`bi order-expand-icon ${expanded === order.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </div>
                  </div>

                  {expanded === order.id && (
                    <div className="order-card-body">
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="order-item-img" />
                            )}
                            <div className="order-item-details">
                              <p className="order-item-name">{item.name}</p>
                              <p className="order-item-qty">Qty: {item.quantity}</p>
                            </div>
                            <span className="order-item-price">{fmt(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <span>
                          <i className="bi bi-credit-card me-1"></i>
                          {order.paymentMethod}
                        </span>
                        <strong>Total: {fmt(order.total)}</strong>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
