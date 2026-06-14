import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-accent"></div>
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <i className="bi bi-box-seam"></i>TechVault
            </Link>
            <p className="footer-tagline">Your one-stop destination for premium tech and electronics.</p>
            <div className="footer-socials">
              {[
                { icon: 'bi-facebook',  label: 'Facebook'  },
                { icon: 'bi-instagram', label: 'Instagram' },
                { icon: 'bi-twitter',   label: 'Twitter'   },
                { icon: 'bi-youtube',   label: 'YouTube'   },
                { icon: 'bi-github',    label: 'GitHub'    },
              ].map(({ icon, label }) => (
                <a key={icon} href="#" className="footer-social-btn" aria-label={label}>
                  <i className={`bi ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="footer-col-head"><i className="bi bi-headset me-1"></i>Support</p>
            <ul className="footer-links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Shipping &amp; Returns</a></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <p className="footer-col-head"><i className="bi bi-shop me-1"></i>Shop</p>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=phone">Smartphones</Link></li>
              <li><Link to="/products?category=watch">Smart Watches</Link></li>
              <li><Link to="/products?category=laptop">Laptops</Link></li>
              <li><Link to="/products?category=speaker">Speakers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-col-head"><i className="bi bi-building me-1"></i>Company</p>
            <ul className="footer-links">
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Terms &amp; Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">&copy; {new Date().getFullYear()} TechVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
