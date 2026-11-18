import { createContext, useContext, useState, useEffect } from 'react';

const ACCENT_PRESETS = {
  blue: { name: 'Techvick Blue', primary: '#0284c7', accent: '#38bdf8', gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)' },
  indigo: { name: 'Axora Electric Indigo', primary: '#4f46e5', accent: '#6366f1', gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)' },
  violet: { name: 'Cyber Violet', primary: '#7c3aed', accent: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)' },
  emerald: { name: 'Tech Emerald', primary: '#059669', accent: '#10b981', gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' },
  amber: { name: 'Amber Flame', primary: '#d97706', accent: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)' },
};

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  accent: 'blue',
  density: 'comfortable',
  fontFamily: 'modern',
  toggleTheme: () => {},
  setTheme: () => {},
  setAccent: () => {},
  setDensity: () => {},
  setFontFamily: () => {},
  resetAppearance: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('techvick_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [accent, setAccentState] = useState(() => {
    try {
      return localStorage.getItem('techvick_accent') || 'blue';
    } catch {
      return 'blue';
    }
  });

  const [density, setDensityState] = useState(() => {
    try {
      return localStorage.getItem('techvick_density') || 'comfortable';
    } catch {
      return 'comfortable';
    }
  });

  const [fontFamily, setFontFamilyState] = useState(() => {
    try {
      return localStorage.getItem('techvick_font') || 'modern';
    } catch {
      return 'modern';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('techvick_theme', theme);
      localStorage.setItem('techvick_accent', accent);
      localStorage.setItem('techvick_density', density);
      localStorage.setItem('techvick_font', fontFamily);
    } catch {}

    const doc = document.documentElement;
    doc.setAttribute('data-theme', theme);
    doc.setAttribute('data-accent', accent);
    doc.setAttribute('data-density', density);
    doc.setAttribute('data-font', fontFamily);

    doc.classList.remove('theme-dark', 'theme-light');
    doc.classList.add(`theme-${theme}`);

    // Dynamic Accent Variable Injection
    const currentAccent = ACCENT_PRESETS[accent] || ACCENT_PRESETS.blue;
    doc.style.setProperty('--primary-600', currentAccent.primary);
    doc.style.setProperty('--text-accent', currentAccent.accent);
    doc.style.setProperty('--accent-400', currentAccent.accent);
    doc.style.setProperty('--gradient-primary', currentAccent.gradient);
  }, [theme, accent, density, fontFamily]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') setThemeState(newTheme);
  };

  const setAccent = (newAccent) => {
    if (ACCENT_PRESETS[newAccent]) setAccentState(newAccent);
  };

  const setDensity = (newDensity) => {
    if (newDensity === 'comfortable' || newDensity === 'compact') setDensityState(newDensity);
  };

  const setFontFamily = (newFont) => {
    if (newFont === 'modern' || newFont === 'inter') setFontFamilyState(newFont);
  };

  const resetAppearance = () => {
    setThemeState('dark');
    setAccentState('blue');
    setDensityState('comfortable');
    setFontFamilyState('modern');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        accent,
        density,
        fontFamily,
        toggleTheme,
        setTheme,
        setAccent,
        setDensity,
        setFontFamily,
        resetAppearance,
        accentPresets: ACCENT_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

