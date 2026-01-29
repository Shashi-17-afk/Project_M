// Theme Switcher Functionality
(function() {
  'use strict';

  // Available themes
  const themes = {
    light: {
      name: 'Light',
      icon: 'bi-sun',
      colors: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f4f4f4',
        '--bg-tertiary': '#f8f9fa',
        '--text-primary': '#212529',
        '--text-secondary': '#6c757d',
        '--header-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--card-bg': '#ffffff',
        '--border-color': '#dee2e6',
        '--shadow': 'rgba(0, 0, 0, 0.1)',
        '--accent': '#667eea'
      }
    },
    dark: {
      name: 'Dark',
      icon: 'bi-moon-stars',
      colors: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#2d2d2d',
        '--bg-tertiary': '#3a3a3a',
        '--text-primary': '#ffffff',
        '--text-secondary': '#b0b0b0',
        '--header-bg': 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
        '--card-bg': '#2d2d2d',
        '--border-color': '#404040',
        '--shadow': 'rgba(0, 0, 0, 0.5)',
        '--accent': '#667eea'
      }
    },
    blue: {
      name: 'Ocean Blue',
      icon: 'bi-water',
      colors: {
        '--bg-primary': '#e8f4f8',
        '--bg-secondary': '#d1e9f1',
        '--bg-tertiary': '#b8dce8',
        '--text-primary': '#0a2540',
        '--text-secondary': '#1e4a6b',
        '--header-bg': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        '--card-bg': '#ffffff',
        '--border-color': '#bae6fd',
        '--shadow': 'rgba(14, 165, 233, 0.2)',
        '--accent': '#0ea5e9'
      }
    },
    purple: {
      name: 'Purple Dream',
      icon: 'bi-stars',
      colors: {
        '--bg-primary': '#f5f3ff',
        '--bg-secondary': '#ede9fe',
        '--bg-tertiary': '#ddd6fe',
        '--text-primary': '#4c1d95',
        '--text-secondary': '#6d28d9',
        '--header-bg': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        '--card-bg': '#ffffff',
        '--border-color': '#c4b5fd',
        '--shadow': 'rgba(139, 92, 246, 0.2)',
        '--accent': '#8b5cf6'
      }
    },
    green: {
      name: 'Forest Green',
      icon: 'bi-tree',
      colors: {
        '--bg-primary': '#f0fdf4',
        '--bg-secondary': '#dcfce7',
        '--bg-tertiary': '#bbf7d0',
        '--text-primary': '#14532d',
        '--text-secondary': '#166534',
        '--header-bg': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        '--card-bg': '#ffffff',
        '--border-color': '#86efac',
        '--shadow': 'rgba(34, 197, 94, 0.2)',
        '--accent': '#22c55e'
      }
    },
    sunset: {
      name: 'Sunset',
      icon: 'bi-sunset',
      colors: {
        '--bg-primary': '#fff7ed',
        '--bg-secondary': '#ffedd5',
        '--bg-tertiary': '#fed7aa',
        '--text-primary': '#7c2d12',
        '--text-secondary': '#9a3412',
        '--header-bg': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        '--card-bg': '#ffffff',
        '--border-color': '#fdba74',
        '--shadow': 'rgba(249, 115, 22, 0.2)',
        '--accent': '#f97316'
      }
    }
  };

  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    updateThemeButton(savedTheme);
  }

  // Apply theme to the document
  function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.keys(theme.colors).forEach(key => {
      root.style.setProperty(key, theme.colors[key]);
    });

    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);

    // Store theme preference
    localStorage.setItem('theme', themeName);
  }

  // Update theme button icon
  function updateThemeButton(themeName) {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    if (themeBtn && themeIcon) {
      const theme = themes[themeName];
      if (theme) {
        themeIcon.className = `bi ${theme.icon}`;
        themeBtn.setAttribute('data-current-theme', themeName);
      }
    }
  }

  // Create theme picker modal
  function createThemePicker() {
    // Check if modal already exists
    if (document.getElementById('themePickerModal')) {
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'themePickerModal';
    modal.className = 'theme-picker-modal';
    modal.innerHTML = `
      <div class="theme-picker-content">
        <div class="theme-picker-header">
          <h3>
            <i class="bi bi-palette"></i>
            Choose Your Theme
          </h3>
          <button class="theme-picker-close" id="closeThemePicker">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="theme-picker-grid">
          ${Object.keys(themes).map(themeKey => {
            const theme = themes[themeKey];
            return `
              <div class="theme-option" data-theme="${themeKey}">
                <div class="theme-preview">
                  <div class="theme-preview-header"></div>
                  <div class="theme-preview-body"></div>
                </div>
                <div class="theme-info">
                  <i class="bi ${theme.icon}"></i>
                  <span>${theme.name}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = document.getElementById('closeThemePicker');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeThemePicker);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeThemePicker();
      }
    });

    // Add click listeners to theme options
    const themeOptions = modal.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const themeName = option.getAttribute('data-theme');
        applyTheme(themeName);
        updateThemeButton(themeName);
        closeThemePicker();
      });
    });
  }

  // Open theme picker
  function openThemePicker() {
    createThemePicker();
    const modal = document.getElementById('themePickerModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  // Close theme picker
  function closeThemePicker() {
    const modal = document.getElementById('themePickerModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Add theme toggle button event listener
  document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', openThemePicker);
    }
  });

  // Export functions for global access
  window.ThemeSwitcher = {
    applyTheme,
    openThemePicker,
    closeThemePicker,
    getCurrentTheme: () => localStorage.getItem('theme') || 'light'
  };
})();
