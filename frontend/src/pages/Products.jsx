import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'all', label: 'All Products', icon: 'bi-grid' },
  { key: 'phone', label: 'Phones', icon: 'bi-phone' },
  { key: 'laptop', label: 'Laptops', icon: 'bi-laptop' },
  { key: 'watch', label: 'Watches', icon: 'bi-smartwatch' },
  { key: 'audio', label: 'Audio', icon: 'bi-headphones' },
  { key: 'speaker', label: 'Speakers', icon: 'bi-speaker' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (category !== 'all') params.category = category;
    if (search) params.search = search;
    getProducts(params)
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [category, search]);

  const setCategory = (key) => {
    const next = new URLSearchParams();
    if (key !== 'all') next.set('category', key);
    setSearchParams(next);
  };

  const clearSearch = () => setSearchParams({});

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-page-header">
        <h2>
          <i className="bi bi-grid-3x3-gap me-2"></i>
          {search ? `Results for "${search}"` : 'All Products'}
        </h2>
        {search && (
          <p>
            {products.length} result{products.length !== 1 ? 's' : ''} found
            <button
              onClick={clearSearch}
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', cursor: 'pointer', marginLeft: '12px' }}
            >
              <i className="bi bi-x me-1"></i>Clear
            </button>
          </p>
        )}
      </div>

      {/* Category Filter */}
      {!search && (
        <div className="filter-bar">
          <div className="filter-bar-inner">
            {CATEGORIES.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`cat-btn${category === key ? ' active' : ''}`}
                onClick={() => setCategory(key)}
              >
                <i className={`bi ${icon}`}></i> {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="products-grid-wrap">
        {loading ? (
          <div className="page-loader">
            <div className="spinner-border" role="status"></div>
            <span>Loading products…</span>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-search"></i>
            <h3>No products found</h3>
            <p>
              {search
                ? `No results for "${search}". Try a different keyword.`
                : 'No products in this category yet.'}
            </p>
            <button className="btn btn-outline-primary mt-3" onClick={clearSearch}>
              View all products
            </button>
          </div>
        ) : (
          <div className="product-list">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
