import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ThemePicker from './ThemePicker';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, themes } = useTheme();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'bi-house' },
    { to: '/products', label: 'Products', icon: 'bi-grid' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header className="site-header">
        <div className="nav-inner">
          {/* Brand */}
          <Link to="/" className="nav-brand" aria-label="TechVault home">
            <i className="bi bi-box-seam nav-brand-icon"></i>
            <span>TechVault</span>
          </Link>

          {/* Desktop Search */}
          <form className="nav-search" onSubmit={handleSearch} role="search">
            <i className="bi bi-search nav-search-icon"></i>
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button type="button" className="nav-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <i className="bi bi-x"></i>
              </button>
            )}
          </form>

          {/* Desktop Nav Links */}
          <nav className="nav-links" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link${isActive(to) ? ' active' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            {/* Cart */}
            <Link to="/cart" className={`nav-icon-btn cart-btn${isActive('/cart') ? ' active' : ''}`} aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
              <i className="bi bi-bag"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
            </Link>

            {/* Theme */}
            <button
              className="nav-icon-btn"
              onClick={() => setShowThemePicker(true)}
              aria-label="Change theme"
            >
              <i className={`bi ${themes[theme]?.icon || 'bi-palette'}`}></i>
            </button>

            {/* Auth */}
            {!user ? (
              <button className="nav-login-btn" onClick={() => setShowLoginModal(true)}>
                <i className="bi bi-person me-1 d-none d-sm-inline"></i>Login
              </button>
            ) : (
              <div className="nav-profile" ref={dropdownRef}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => setShowDropdown(o => !o)}
                  aria-expanded={showDropdown}
                  aria-label="Open profile menu"
                >
                  <span className="avatar-initials">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                  <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} avatar-chevron`}></i>
                </button>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar-lg">{user.username?.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="pd-name">{user.username}</div>
                        <div className="pd-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="profile-dropdown-body">
                      <Link to="/orders" className="pd-item" onClick={() => setShowDropdown(false)}>
                        <i className="bi bi-box-seam"></i><span>My Orders</span>
                      </Link>
                      <Link to="/settings" className="pd-item" onClick={() => setShowDropdown(false)}>
                        <i className="bi bi-gear"></i><span>Settings</span>
                      </Link>
                    </div>
                    <div className="profile-dropdown-footer">
                      <button className="pd-logout" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i><span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
          <form className="mobile-search" onSubmit={handleSearch} role="search">
            <i className="bi bi-search"></i>
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit"><i className="bi bi-arrow-right"></i></button>
          </form>

          <nav className="mobile-nav-links">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to} className={`mobile-nav-link${isActive(to) ? ' active' : ''}`}>
                <i className={`bi ${icon}`}></i><span>{label}</span>
              </Link>
            ))}
            <Link to="/cart" className={`mobile-nav-link${isActive('/cart') ? ' active' : ''}`}>
              <i className="bi bi-bag"></i>
              <span>Cart</span>
              {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
            </Link>
            {user && (
              <>
                <Link to="/orders" className={`mobile-nav-link${isActive('/orders') ? ' active' : ''}`}>
                  <i className="bi bi-box-seam"></i><span>My Orders</span>
                </Link>
                <Link to="/settings" className={`mobile-nav-link${isActive('/settings') ? ' active' : ''}`}>
                  <i className="bi bi-gear"></i><span>Settings</span>
                </Link>
              </>
            )}
          </nav>

          <div className="mobile-menu-footer">
            <button className="mobile-theme-btn" onClick={() => { setShowThemePicker(true); setMobileOpen(false); }}>
              <i className={`bi ${themes[theme]?.icon || 'bi-palette'}`}></i>
              <span>Change Theme</span>
            </button>
            {!user ? (
              <button className="mobile-login-btn" onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}>
                <i className="bi bi-person"></i><span>Login / Register</span>
              </button>
            ) : (
              <button className="mobile-logout-btn" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                <i className="bi bi-box-arrow-right"></i><span>Logout ({user.username})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <ThemePicker show={showThemePicker} onClose={() => setShowThemePicker(false)} />
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
