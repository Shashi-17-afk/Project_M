const router = require('express').Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const store = require('../db/store');
const { v4: uuidv4 } = require('uuid');

// Instantiate Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const amountInPaise = parseInt(amount, 10);
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise (1 INR)' });
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${uuidv4().slice(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ message: 'Error creating payment order', error: err.message });
  }
});

// POST /api/verify-payment
router.post('/verify-payment', auth, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required Razorpay fields' });
    }

    if (!orderData || !orderData.items || !orderData.items.length || !orderData.total) {
      return res.status(400).json({ message: 'Missing order details for verification' });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Payment verification failed: Signature mismatch' });
    }

    // Create the order structure in backend store.js
    const order = {
      id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      items: orderData.items,
      total: orderData.total,
      paymentMethod: 'razorpay',
      shippingAddress: orderData.shippingAddress || {},
      status: 'Processing',
      createdAt: new Date().toISOString(),
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    };

    if (!store.orders[req.user.userId]) {
      store.orders[req.user.userId] = [];
    }
    store.orders[req.user.userId].unshift(order);

    // Clear cart after placing order
    store.carts[req.user.userId] = [];

    res.json({ success: true, order });
  } catch (err) {
    console.error('Error verifying Razorpay signature:', err);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
});

module.exports = router;
