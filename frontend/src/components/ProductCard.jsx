import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Stars({ rating }) {
  return (
    <div className="product-card-rating">
      {[1, 2, 3, 4, 5].map(s => (
        <i
          key={s}
          className={`bi ${
            s <= Math.floor(rating) ? 'bi-star-fill' :
            s - 0.5 <= rating ? 'bi-star-half' : 'bi-star'
          }`}
        />
      ))}
      <span>({rating})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    setLoading(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
    Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const savings = product.originalPrice - product.price;

  return (
    <Link to={`/products/${product.id}`} className="product-card-link">
      <article className="product-card">
        {/* Image */}
        <div className="product-card-img-wrap">
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.discount > 0 && (
            <span className="product-discount-badge">-{product.discount}%</span>
          )}
        </div>

        {/* Body */}
        <div className="product-card-body">
          <p className="product-card-name">{product.name}</p>
          <Stars rating={product.rating} />
          <div className="product-card-price">
            <span className="price">${fmt(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="original">${fmt(product.originalPrice)}</span>
                <span className="discount-pct">Save ${fmt(savings)}</span>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="product-card-footer">
          <button
            className={`btn-add-cart${added ? ' added' : ''}`}
            onClick={handleAddToCart}
            disabled={loading || added}
            aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : added ? (
              <><i className="bi bi-check-lg"></i> Added to Cart</>
            ) : (
              <><i className="bi bi-bag-plus"></i> Add to Cart</>
            )}
          </button>
        </div>
      </article>
    </Link>
  );
}
