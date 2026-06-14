import { useTheme } from '../context/ThemeContext';

export default function ThemePicker({ show, onClose }) {
  const { theme, themes, setTheme } = useTheme();

  if (!show) return null;

  return (
    <div
      className="theme-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Choose theme"
    >
      <div className="theme-modal-card">
        <div className="theme-modal-head">
          <h3><i className="bi bi-palette2"></i> Choose Your Theme</h3>
          <button className="btn-close-theme" onClick={onClose} aria-label="Close theme picker">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="theme-grid">
          {Object.entries(themes).map(([key, t]) => (
            <div
              key={key}
              className={`theme-option${theme === key ? ' active' : ''}`}
              onClick={() => { setTheme(key); onClose(); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (() => { setTheme(key); onClose(); })()}
              aria-pressed={theme === key}
              aria-label={`${t.name} theme`}
            >
              <div className="theme-preview">
                <div className="theme-preview-header" style={{ background: t.colors['--header-bg'] }} />
                <div className="theme-preview-body" style={{ background: t.colors['--bg-secondary'] }} />
              </div>
              <div className="theme-info">
                <i className={`bi ${t.icon}`}></i>
                <span>{t.name}</span>
                {theme === key && <i className="bi bi-check-circle-fill text-success"></i>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
