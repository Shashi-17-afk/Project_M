const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const store = require('../db/store');

// GET /api/orders
router.get('/', auth, (req, res) => {
  res.json(store.orders[req.user.userId] || []);
});

// POST /api/orders
router.post('/', auth, (req, res) => {
  const { items, total, paymentMethod, shippingAddress } = req.body;
  if (!items || !items.length || !total || !paymentMethod) {
    return res.status(400).json({ message: 'items, total, and paymentMethod are required' });
  }
  const order = {
    id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
    items,
    total,
    paymentMethod,
    shippingAddress: shippingAddress || {},
    status: 'Processing',
    createdAt: new Date().toISOString(),
  };
  if (!store.orders[req.user.userId]) {
    store.orders[req.user.userId] = [];
  }
  store.orders[req.user.userId].unshift(order);
  // Clear cart after placing order
  store.carts[req.user.userId] = [];
  res.status(201).json(order);
});

module.exports = router;
