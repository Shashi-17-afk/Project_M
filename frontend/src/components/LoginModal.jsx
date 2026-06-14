import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function LoginModal({ show, onClose }) {
  const { login, register } = useAuth();
  const { fetchCart } = useCart();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      await fetchCart();
      onClose();
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
    setForm({ username: '', email: '', password: '' });
  };

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="form-container" role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Login' : 'Create account'}>
        <p className="title">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="input-group">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your display name"
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="alert-error" role="alert">
              <i className="bi bi-exclamation-circle-fill"></i>
              {error}
            </div>
          )}

          <button type="submit" className="sign" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        <div className="social-message">
          <div className="line"></div>
          <p className="message">Or continue with</p>
          <div className="line"></div>
        </div>

        <div className="d-flex justify-content-center gap-3 my-2">
          {[
            { cls: 'bi-google', label: 'Google' },
            { cls: 'bi-facebook', label: 'Facebook' },
            { cls: 'bi-twitter', label: 'Twitter' },
          ].map(({ cls, label }) => (
            <span
              key={cls}
              className={`bi ${cls} social-login-btn`}
              role="button"
              title={`Continue with ${label}`}
              aria-label={`Continue with ${label} (demo only)`}
              onClick={() => setError('Social login is unavailable in demo mode.')}
            ></span>
          ))}
        </div>

        <p className="signup">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <a href="#" onClick={(e) => { e.preventDefault(); switchMode(); }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
}
