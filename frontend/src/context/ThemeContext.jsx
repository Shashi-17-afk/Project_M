import { createContext, useContext, useState, useEffect } from 'react';

export const themes = {
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
      '--accent': '#667eea',
      '--footer-bg': '#1a1a2e',
      '--footer-text': '#e2e8f0',
      '--footer-muted': 'rgba(255,255,255,0.7)',
    },
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
      '--accent': '#667eea',
      '--footer-bg': '#111111',
      '--footer-text': '#e2e8f0',
      '--footer-muted': 'rgba(255,255,255,0.6)',
    },
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
      '--accent': '#0ea5e9',
      '--footer-bg': '#0a2540',
      '--footer-text': '#e2e8f0',
      '--footer-muted': 'rgba(255,255,255,0.7)',
    },
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
      '--accent': '#8b5cf6',
      '--footer-bg': '#2e1065',
      '--footer-text': '#e2e8f0',
      '--footer-muted': 'rgba(255,255,255,0.7)',
    },
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
      '--accent': '#22c55e',
      '--footer-bg': '#052e16',
      '--footer-text': '#e2e8f0',
      '--footer-muted': 'rgba(255,255,255,0.7)',
    },
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
      '--accent': '#f97316',
      '--footer-bg': '#431407',
      '--footer-text': '#e2e8f0',
      '--footer-muted': 'rgba(255,255,255,0.7)',
    },
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeName] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const t = themes[theme];
    if (!t) return;
    const root = document.documentElement;
    Object.entries(t.colors).forEach(([key, val]) => root.style.setProperty(key, val));
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (name) => {
    if (themes[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themes, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
