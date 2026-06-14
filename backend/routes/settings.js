const router = require('express').Router();
const auth = require('../middleware/auth');
const store = require('../db/store');

const defaultSettings = {
  emailNotifications: true,
  smsNotifications: false,
  newsletter: true,
  profileVisibility: true,
  dataSharing: false,
};

// GET /api/settings
router.get('/', auth, (req, res) => {
  const user = store.users.find(u => u.id === req.user.userId);
  const prefs = store.settings[req.user.userId] || { ...defaultSettings };
  res.json({
    username: user?.username || req.user.username,
    email: user?.email || req.user.email,
    ...prefs,
  });
});

// PUT /api/settings
router.put('/', auth, (req, res) => {
  const { username, email, emailNotifications, smsNotifications, newsletter, profileVisibility, dataSharing } = req.body;
  const idx = store.users.findIndex(u => u.id === req.user.userId);
  if (idx !== -1) {
    if (username) store.users[idx].username = username.trim();
    if (email) store.users[idx].email = email.toLowerCase().trim();
  }
  store.settings[req.user.userId] = {
    emailNotifications: emailNotifications ?? true,
    smsNotifications: smsNotifications ?? false,
    newsletter: newsletter ?? true,
    profileVisibility: profileVisibility ?? true,
    dataSharing: dataSharing ?? false,
  };
  res.json({ message: 'Settings updated successfully' });
});

module.exports = router;
