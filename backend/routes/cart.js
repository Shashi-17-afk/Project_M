const router = require('express').Router();
const auth = require('../middleware/auth');
const store = require('../db/store');
const productsData = require('../data/products.json');
const products = productsData.products;

// GET /api/cart
router.get('/', auth, (req, res) => {
  const cartItems = store.carts[req.user.userId] || [];
  const enriched = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);
  res.json(enriched);
});

// POST /api/cart  — add or update item
router.post('/', auth, (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity == null) {
    return res.status(400).json({ message: 'productId and quantity are required' });
  }
  if (!store.carts[req.user.userId]) {
    store.carts[req.user.userId] = [];
  }
  const cart = store.carts[req.user.userId];
  const idx = cart.findIndex(i => i.productId === productId);
  if (quantity <= 0) {
    if (idx !== -1) cart.splice(idx, 1);
  } else if (idx !== -1) {
    cart[idx].quantity = quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.json({ message: 'Cart updated' });
});

// DELETE /api/cart/:productId
router.delete('/:productId', auth, (req, res) => {
  if (store.carts[req.user.userId]) {
    store.carts[req.user.userId] = store.carts[req.user.userId].filter(
      i => i.productId !== req.params.productId
    );
  }
  res.json({ message: 'Item removed' });
});

// DELETE /api/cart  — clear entire cart
router.delete('/', auth, (req, res) => {
  store.carts[req.user.userId] = [];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
