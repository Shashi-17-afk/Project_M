// React component for product detail page
const { useState, useEffect } = React;

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    // Determine the correct path to products.json
    const currentPath = window.location.pathname || window.location.href;
    let jsonPath = '../Data/products.json';
    
    if (currentPath.includes('/src/Html/') || currentPath.includes('\\src\\Html\\')) {
      jsonPath = '../Data/products.json';
    } else if (currentPath.includes('/Html/')) {
      jsonPath = '../../src/Data/products.json';
    }

    const pathsToTry = [
      jsonPath,
      '../Data/products.json',
      '../../Data/products.json',
      '../../src/Data/products.json',
      './src/Data/products.json'
    ];

    const tryFetch = (path) => {
      return fetch(path)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          return response.json();
        });
    };

    let fetchPromise = tryFetch(pathsToTry[0]);
    
    for (let i = 1; i < pathsToTry.length; i++) {
      const nextPath = pathsToTry[i];
      fetchPromise = fetchPromise.catch(() => tryFetch(nextPath));
    }

    fetchPromise
      .then(data => {
        const foundProduct = data.products.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (e, redirectToCart = false) => {
    if (!product) return;

    const productId = product.id;
    const productName = product.name;
    const productPrice = product.price;
    const productImage = product.image;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Show confirmation
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = redirectToCart ? "Adding..." : "Added to Cart!";
    btn.style.backgroundColor = "#28a745";
    btn.style.color = "white";
    
    if (redirectToCart) {
      // Redirect to cart page after a short delay
      setTimeout(() => {
        const currentPath = window.location.pathname || window.location.href;
        let cartPath = 'carts.html';
        
        // Determine correct path based on current location
        if (currentPath.includes('/src/Html/') || currentPath.includes('\\src\\Html\\')) {
          cartPath = 'carts.html';
        } else if (currentPath.includes('/Html/')) {
          cartPath = 'src/Html/carts.html';
        } else {
          cartPath = 'src/Html/carts.html';
        }
        
        window.location.href = cartPath;
      }, 300);
    } else {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 2000);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(React.createElement('span', { key: i, className: 'bi bi-star-fill' }));
      } else {
        stars.push(React.createElement('span', { key: i, className: 'bi bi-star' }));
      }
    }
    return stars;
  };

  if (loading) {
    return React.createElement('div', { style: { textAlign: 'center', padding: '50px' } }, 
      React.createElement('p', null, 'Loading product details...')
    );
  }

  if (error || !product) {
    return React.createElement('div', { style: { textAlign: 'center', padding: '50px' } },
      React.createElement('p', { className: 'text-danger' }, error || 'Product not found'),
      React.createElement('a', { href: 'products.html', className: 'btn btn-primary mt-3' }, 'Back to Products')
    );
  }

  // Render product details section
  const productImage = product.detailImage || product.image;
  
  return React.createElement(React.Fragment, null,
    // Product section
    React.createElement('section', { className: 'product-detail-section' },
      React.createElement('div', { className: 'product-image-container' },
        React.createElement('img', {
          src: productImage,
          alt: product.name,
          className: 'product-main-image'
        })
      ),
      React.createElement('div', { className: 'product-details' },
        React.createElement('h1', { className: 'product-name' }, product.name),
        React.createElement('p', { className: 'product-description' }, product.description),
        React.createElement('div', { className: 'rating-section' },
          React.createElement('span', { className: 'rating-value' }, product.rating || 4.6),
          React.createElement('span', { className: 'rating-stars' },
            ...renderStars(product.rating || 4.6)
          )
        ),
        React.createElement('hr', { className: 'divider' }),
        React.createElement('div', { className: 'price-section' },
          React.createElement('span', { className: 'discount-badge' },
            React.createElement('span', { className: 'text-danger fw-bold' }, `-${product.discount}%`)
          ),
          React.createElement('div', { className: 'price-container' },
            React.createElement('span', { className: 'original-price' }, `$${formatPrice(product.originalPrice)}`),
            React.createElement('span', { className: 'current-price' }, `$${formatPrice(product.price)}`)
          )
        ),
        React.createElement('div', { className: 'button-group' },
          React.createElement('button', {
            className: 'btn btn-primary btn-lg buy-now-btn',
            onClick: (e) => handleAddToCart(e, true)
          }, 'BUY NOW!!'),
          React.createElement('button', {
            className: 'btn btn-warning btn-lg add-cart-btn',
            onClick: (e) => handleAddToCart(e, false)
          }, 'Add to Cart')
        ),
        React.createElement('div', { className: 'payment-info' },
          React.createElement('p', null,
            'Inclusive of all taxes',
            React.createElement('br'),
            React.createElement('b', null, 'EMI'),
            ' starts at ₹4,843. No Cost EMI available'
          )
        ),
        React.createElement('hr', { className: 'divider' }),
        // Specifications
        React.createElement('div', { className: 'specifications' },
          React.createElement('h3', { className: 'specs-title' }, 'Specifications'),
          React.createElement('dl', { className: 'specs-list' },
            Object.entries(product.specs || {}).map(([key, value]) =>
              React.createElement(React.Fragment, { key: key },
                React.createElement('dt', { className: 'spec-key' }, key),
                React.createElement('dd', { className: 'spec-value' }, value)
              )
            )
          )
        )
      )
    ),
    // Full width detail image if available
    product.detailImage && React.createElement('main', null,
      React.createElement('img', {
        src: product.detailImage,
        alt: product.name,
        style: { width: '100%' }
      })
    )
  );
}

// Wait for React to be available
function initProductDetail() {
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.log('Waiting for React to load...');
    setTimeout(initProductDetail, 50);
    return;
  }

  console.log('React loaded, initializing product detail...');

  const productDetailRoot = document.getElementById('product-detail-root');
  if (productDetailRoot) {
    try {
      const root = ReactDOM.createRoot(productDetailRoot);
      root.render(React.createElement(ProductDetail));
      console.log('Product detail rendered successfully');
    } catch (error) {
      console.error('Error rendering product detail:', error);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductDetail);
} else {
  initProductDetail();
}
