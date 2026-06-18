import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { icon: 'bi-phone-fill', title: 'Smartphones', desc: 'Latest phones & accessories', cat: 'phone' },
  { icon: 'bi-laptop', title: 'Laptops', desc: 'Powerful machines for every need', cat: 'laptop' },
  { icon: 'bi-smartwatch', title: 'Watches', desc: 'Smartwatches & wearables', cat: 'watch' },
  { icon: 'bi-headphones', title: 'Audio', desc: 'Headphones & earbuds', cat: 'audio' },
  { icon: 'bi-speaker-fill', title: 'Speakers', desc: 'Premium sound systems', cat: 'speaker' },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    q: 'What is TechVault?',
    a: 'TechVault is your ultimate destination for cutting-edge electronics — a curated selection of smartphones, laptops, smartwatches, and audio gear that blends innovation with style.'
  },
  {
    id: 'faq-2',
    q: 'What do we offer?',
    a: 'Sleek smartwatches, powerful smartphones, high-performance laptops, and crystal-clear audio equipment — each product crafted to bring innovation and elegance into your daily life.'
  },
  {
    id: 'faq-3',
    q: 'Why choose TechVault?',
    a: 'We combine quality products, competitive pricing, and exceptional customer support. Our seamless shopping experience — from browsing to delivery — puts your satisfaction first.'
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(({ data }) => setProducts(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h2>Discover Next-Gen Tech</h2>
        <p>Shop the finest electronics — handpicked for performance, style, and everyday brilliance.</p>
        <Link to="/products" className="btn-hero">
          <i className="bi bi-shop"></i> Explore Products
        </Link>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2 className="section-heading">
          <i className="bi bi-lightning-charge-fill"></i> Featured Products
        </h2>
        {loading ? (
          <div className="page-loader">
            <div className="spinner-border text-primary" role="status"></div>
            <span>Loading products…</span>
          </div>
        ) : (
          <div className="product-list">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <div className="mt-4">
          <Link to="/products" className="btn btn-outline-primary px-4">
            View All Products <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="categories-section">
        <div className="categories-section-inner">
          <h2 className="categories-title">
            <i className="bi bi-grid-3x3-gap-fill"></i> Browse Categories
          </h2>
          <p className="categories-subtitle">Shop by category and find exactly what you need</p>
          <div className="categories-grid">
            {CATEGORIES.map(({ icon, title, desc, cat }) => (
              <Link to={`/products?category=${cat}`} className="category-card" key={cat}>
                <div className="cat-icon-wrap">
                  <i className={`bi ${icon}`}></i>
                </div>
                <h3 className="cat-title">{title}</h3>
                <p className="cat-desc">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-inner">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="accordion" id="faq-accordion" data-bs-theme="dark">
            {FAQ_ITEMS.map(({ id, q, a }) => (
              <div className="accordion-item" key={id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', marginBottom: '8px', borderRadius: '10px', overflow: 'hidden' }}>
                <h4 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}`}
                    aria-expanded="false"
                    style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}
                  >
                    {q}
                  </button>
                </h4>
                <div id={id} className="accordion-collapse collapse" data-bs-parent="#faq-accordion">
                  <div className="accordion-body" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
