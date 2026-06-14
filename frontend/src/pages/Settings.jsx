import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getSettings, updateSettings } from '../api';

const NOTIFICATION_PREFS = [
  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Order updates and promotions via email' },
  { key: 'smsNotifications',   label: 'SMS Notifications',   desc: 'Text messages for order status' },
  { key: 'newsletter',         label: 'Newsletter',          desc: 'Weekly deals and new arrivals' },
];

const PRIVACY_PREFS = [
  { key: 'profileVisibility', label: 'Public Profile', desc: 'Allow others to view your profile' },
  { key: 'dataSharing',       label: 'Usage Data',     desc: 'Share anonymous data to improve TechVault' },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', email: '',
    emailNotifications: true, smsNotifications: false,
    newsletter: true, profileVisibility: true, dataSharing: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getSettings()
      .then(({ data }) => setForm(f => ({ ...f, ...data })))
      .catch(() => showToast('Failed to load settings.', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      showToast('Settings saved successfully!');
    } catch {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Clear your entire cart?')) return;
    await clearCart();
    showToast('Cart cleared.');
  };

  const handleDeleteAccount = () => {
    if (!confirm('Permanently delete your account? This cannot be undone.')) return;
    logout();
    navigate('/');
  };

  const toggle = (key) => setForm(f => ({ ...f, [key]: !f[key] }));

  if (!user) return (
    <div className="settings-page">
      <div className="settings-page-inner">
        <div className="no-orders">
          <i className="bi bi-person-lock"></i>
          <h3>Please log in to access settings</h3>
          <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-page-inner">
        <h1 className="page-title">
          <i className="bi bi-gear-fill"></i> Settings
        </h1>

        {/* Toast */}
        {toast && (
          <div
            className={toast.type === 'error' ? 'alert-error' : 'alert-success'}
            style={{ marginBottom: '1.25rem' }}
            role="status"
          >
            <i className={`bi ${toast.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'} me-2`}></i>
            {toast.msg}
          </div>
        )}

        {loading ? (
          <div className="page-loader">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Profile */}
            <div className="settings-card">
              <div className="settings-card-head">
                <i className="bi bi-person-circle"></i>
                <h4>Profile</h4>
              </div>
              <div className="settings-card-body">
                <div className="settings-field">
                  <label htmlFor="s-username">Username</label>
                  <input
                    id="s-username"
                    type="text"
                    className="settings-input"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="Your display name"
                  />
                </div>
                <div className="settings-field">
                  <label htmlFor="s-email">Email Address</label>
                  <input
                    id="s-email"
                    type="email"
                    className="settings-input"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="settings-card">
              <div className="settings-card-head">
                <i className="bi bi-bell-fill"></i>
                <h4>Notifications</h4>
              </div>
              <div className="settings-card-body">
                {NOTIFICATION_PREFS.map(({ key, label, desc }) => (
                  <div key={key} className="toggle-row">
                    <div className="toggle-text">
                      <p className="toggle-label">{label}</p>
                      <p className="toggle-desc">{desc}</p>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch${form[key] ? ' on' : ''}`}
                      onClick={() => toggle(key)}
                      aria-pressed={form[key]}
                      aria-label={label}
                    >
                      <span className="toggle-knob"></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="settings-card">
              <div className="settings-card-head">
                <i className="bi bi-shield-lock-fill"></i>
                <h4>Privacy</h4>
              </div>
              <div className="settings-card-body">
                {PRIVACY_PREFS.map(({ key, label, desc }) => (
                  <div key={key} className="toggle-row">
                    <div className="toggle-text">
                      <p className="toggle-label">{label}</p>
                      <p className="toggle-desc">{desc}</p>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch${form[key] ? ' on' : ''}`}
                      onClick={() => toggle(key)}
                      aria-pressed={form[key]}
                      aria-label={label}
                    >
                      <span className="toggle-knob"></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                : <><i className="bi bi-check-circle me-2"></i>Save Changes</>}
            </button>
          </form>
        )}

        {/* Danger Zone */}
        <div className="settings-card" style={{ borderColor: 'rgba(239,68,68,0.3)', marginTop: '1.5rem' }}>
          <div className="settings-card-head" style={{ background: 'rgba(239,68,68,0.05)' }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ color: '#ef4444' }}></i>
            <h4 style={{ color: '#ef4444' }}>Danger Zone</h4>
          </div>
          <div className="settings-card-body">
            <div className="danger-row">
              <div className="toggle-text">
                <p className="toggle-label">Clear Cart</p>
                <p className="toggle-desc">Remove all items from your shopping cart</p>
              </div>
              <button type="button" className="btn-danger" onClick={handleClearCart}>
                <i className="bi bi-trash me-1"></i>Clear Cart
              </button>
            </div>
            <div className="danger-row">
              <div className="toggle-text">
                <p className="toggle-label">Delete Account</p>
                <p className="toggle-desc">Permanently delete your account and all data</p>
              </div>
              <button type="button" className="btn-danger solid" onClick={handleDeleteAccount}>
                <i className="bi bi-person-x me-1"></i>Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
