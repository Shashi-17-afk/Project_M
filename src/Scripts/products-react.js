// React component for rendering products using React.createElement (no JSX)
const { useState, useEffect } = React;

function ProductCard({ product, isHomePage = false }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get product data
    const productId = product.id;
    const productName = product.name;
    const productPrice = product.price;
    // Ensure image path is correct - handle both relative and absolute paths
    let productImage = product.image;
    if (!productImage.startsWith('http') && !productImage.startsWith('/') && !productImage.startsWith('public/')) {
      productImage = `public/images/${productImage}`;
    }

    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in cart
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

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show confirmation
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.style.backgroundColor = "#28a745";
    btn.style.color = "white";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }, 1000);

    // Trigger cart update if cart display exists
    if (typeof loadCartFromStorage === 'function') {
      loadCartFromStorage();
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Create link to unified product detail page
  const getProductDetailLink = () => {
    const currentPath = window.location.pathname || window.location.href;
    let basePath = 'src/Html/product-detail.html';
    
    // Adjust path based on current location
    if (currentPath.includes('/src/Html/') || currentPath.includes('\\src\\Html\\') || currentPath.includes('Html/')) {
      basePath = 'product-detail.html';
    } else if (currentPath.includes('/Html')) {
      basePath = 'src/Html/product-detail.html';
    }
    
    return `${basePath}?id=${product.id}`;
  };

  const productLink = getProductDetailLink();
  
  const cardContent = React.createElement('div', 
    { className: 'product', 'data-id': product.id },
    React.createElement('img', {
      src: product.image,
      alt: product.name,
      style: { maxWidth: '100%', height: '200px', objectFit: 'cover' }
    }),
    React.createElement('h3', null, product.name),
    React.createElement('p', { className: 'text-secondary' },
      React.createElement('span', { className: 'discount' }, `-${product.discount}%`),
      ' $',
      React.createElement('del', null, formatPrice(product.originalPrice)),
      React.createElement('br'),
      React.createElement('span', { className: 'text-primary fw-bold fs-5' }, `$${formatPrice(product.price)}`)
    ),
    React.createElement('button', {
      className: 'btn btn-outline-primary mb-3 add-to-cart',
      onClick: handleAddToCart
    }, 'Add to Cart')
  );

  return React.createElement('a', 
    { href: productLink, style: { textDecoration: 'none' } },
    cardContent
  );
}

function ProductList({ limit = null, isHomePage = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Determine the correct path to products.json based on current page
    const currentPath = window.location.pathname || window.location.href;
    let jsonPath = './src/Data/products.json';
    
    // If we're in a subdirectory (like src/Html/), adjust the path
    // Check for both forward and backslashes (Windows vs Unix paths)
    if (currentPath.includes('/src/Html/') || currentPath.includes('\\src\\Html\\') || currentPath.includes('Html/products')) {
      jsonPath = '../../Data/products.json';
    } else if (currentPath.includes('/src/') || currentPath.includes('\\src\\')) {
      jsonPath = '../Data/products.json';
    } else if (currentPath.includes('Html')) {
      jsonPath = '../../src/Data/products.json';
    }
    
    // Try multiple paths to find the JSON file
    const pathsToTry = [
      jsonPath,
      './src/Data/products.json',
      '../Data/products.json',
      '../../Data/products.json',
      '../../src/Data/products.json'
    ];
    
    // Helper function to try fetching from a path
    const tryFetch = (path) => {
      return fetch(path)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          return response.json();
        });
    };
    
    // Try each path until one succeeds
    let fetchPromise = tryFetch(pathsToTry[0]);
    
    for (let i = 1; i < pathsToTry.length; i++) {
      const nextPath = pathsToTry[i];
      fetchPromise = fetchPromise.catch(() => tryFetch(nextPath));
    }
    
    fetchPromise
      .then(data => {
        let productsToShow = data.products || [];
        
        // If limit is specified (for home page), show only that many
        if (limit && limit > 0) {
          productsToShow = productsToShow.slice(0, limit);
        }
        
        setProducts(productsToShow);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [limit]);

  if (loading) {
    return React.createElement('div', { className: 'text-white' }, 'Loading products...');
  }

  if (error) {
    return React.createElement('div', { className: 'text-danger' }, `Error loading products: ${error}`);
  }

  if (products.length === 0) {
    return React.createElement('div', { className: 'text-white' }, 'No products available.');
  }

  return React.createElement(React.Fragment, null,
    products.map(product => 
      React.createElement(ProductCard, { key: product.id, product: product, isHomePage: isHomePage })
    )
  );
}

// Wait for React to be available and DOM to be ready
function initProducts() {
  // Check if React is loaded
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.log('Waiting for React to load...');
    setTimeout(initProducts, 50);
    return;
  }

  console.log('React loaded, initializing products...');

  // Render products on home page (index.html)
  const homeProductRoot = document.getElementById('product-list-root');
  if (homeProductRoot) {
    console.log('Found home page root, rendering products...');
    try {
      const root = ReactDOM.createRoot(homeProductRoot);
      root.render(React.createElement(ProductList, { limit: 3, isHomePage: true }));
      console.log('Home page products rendered successfully');
    } catch (error) {
      console.error('Error rendering home page products:', error);
    }
  }

  // Render products on products page
  const productsPageRoot = document.getElementById('products-react-root');
  if (productsPageRoot) {
    console.log('Found products page root, rendering products...');
    try {
      const root = ReactDOM.createRoot(productsPageRoot);
      root.render(React.createElement(ProductList, { isHomePage: false }));
      console.log('Products page rendered successfully');
    } catch (error) {
      console.error('Error rendering products page:', error);
    }
  }
}

// Initialize - try multiple times to ensure everything is loaded
function startInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initProducts, 100);
    });
  } else {
    // DOM already loaded, but wait a bit for scripts
    setTimeout(initProducts, 100);
  }
}

startInit();
