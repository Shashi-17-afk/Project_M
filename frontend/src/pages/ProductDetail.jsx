import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setQty(1);
    getProduct(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { alert('Please log in to add items to your cart.'); return; }
    setAddLoading(true);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { alert('Failed to add to cart. Please try again.'); }
    finally { setAddLoading(false); }
  };

  const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  if (loading) return (
    <div className="page-loader" style={{ minHeight: '70vh', background: 'var(--bg-primary)' }}>
      <div className="spinner-border" role="status"></div>
      <span>Loading product…</span>
    </div>
  );

  if (error || !product) return (
    <div className="product-detail-page">
      <div className="product-detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <i className="bi bi-exclamation-circle" style={{ fontSize: '4rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1rem' }}></i>
        <h3 style={{ color: 'var(--text-primary)' }}>Product not found</h3>
        <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
      </div>
    </div>
  );

  const savings = product.originalPrice - product.price;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="product-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-image-wrap">
            <img src={product.detailImage || product.image} alt={product.name} className="product-detail-img" />
            {product.discount > 0 && (
              <span className="product-detail-badge">-{product.discount}% OFF</span>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <span className="product-detail-category">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>

            {/* Stars */}
            <div className="product-star-row">
              {[1,2,3,4,5].map(s => (
                <i key={s} className={`bi ${s <= Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`}></i>
              ))}
              <span>{product.rating} out of 5</span>
            </div>

            {/* Price */}
            <div className="product-detail-price-block">
              <span className="detail-price">{fmt(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original">{fmt(product.originalPrice)}</span>
                  <span className="detail-save">Save {fmt(savings)}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className="product-detail-stock">
              {product.inStock ? (
                <><i className="bi bi-check-circle-fill text-success me-1"></i> In Stock &amp; Ready to Ship</>
              ) : (
                <><i className="bi bi-x-circle-fill text-danger me-1"></i> Out of Stock</>
              )}
            </p>

            {/* Description */}
            <p className="product-detail-desc">{product.description}</p>

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="product-detail-specs">
                <h5>Specifications</h5>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k}>
                        <td className="spec-key">{k}</td>
                        <td className="spec-val">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actions */}
            {product.inStock && (
              <div className="product-detail-actions">
                <div className="detail-qty-controls" role="group" aria-label="Quantity">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease">
                    <i className="bi bi-dash"></i>
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} aria-label="Increase">
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                <button
                  className={`btn-add-cart-detail${added ? ' added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={addLoading || added}
                >
                  {addLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : added ? (
                    <><i className="bi bi-check-circle"></i> Added to Cart!</>
                  ) : (
                    <><i className="bi bi-bag-plus"></i> Add to Cart</>
                  )}
                </button>

                <Link to="/cart" className="btn-buy-now-detail">
                  <i className="bi bi-lightning-charge-fill"></i> Buy Now
                </Link>
              </div>
            )}

            {/* Trust badges */}
            <div className="detail-trust-badges">
              <span><i className="bi bi-shield-check text-success"></i> Secure Checkout</span>
              <span><i className="bi bi-truck text-primary"></i> Free Shipping</span>
              <span><i className="bi bi-arrow-counterclockwise"></i> 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
