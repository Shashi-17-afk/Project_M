// In-memory data store (acts as a simple database)
const store = {
  users: [],
  carts: {},    // { userId: [{ productId, quantity }] }
  orders: {},   // { userId: [order] }
  settings: {}, // { userId: { ...prefs } }
};

module.exports = store;
