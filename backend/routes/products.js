const router = require('express').Router();
const productsData = require('../data/products.json');
const products = productsData.products;

// GET /api/products
router.get('/', (req, res) => {
  let result = [...products];
  const { category, search } = req.query;
  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }
  res.json(result);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
