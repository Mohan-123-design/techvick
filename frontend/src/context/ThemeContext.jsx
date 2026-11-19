import { createContext, useContext, useState, useEffect } from 'react';

export const ACCENT_PRESETS = {
  blue: {
    name: 'Techvick Blue',
    primary: '#0284c7',
    hover: '#0369a1',
    accent: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    glow: 'rgba(2, 132, 199, 0.4)',
  },
  indigo: {
    name: 'Axora Electric Indigo',
    primary: '#6366f1',
    hover: '#4f46e5',
    accent: '#818cf8',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  violet: {
    name: 'Cyber Violet',
    primary: '#8b5cf6',
    hover: '#7c3aed',
    accent: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  emerald: {
    name: 'Tech Emerald',
    primary: '#10b981',
    hover: '#059669',
    accent: '#34d399',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  amber: {
    name: 'Amber Flame',
    primary: '#f59e0b',
    hover: '#d97706',
    accent: '#fbbf24',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  crimson: {
    name: 'Crimson Red',
    primary: '#e11d48',
    hover: '#be123c',
    accent: '#fb7185',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
    glow: 'rgba(225, 29, 72, 0.4)',
  },
  cyan: {
    name: 'Electric Cyan',
    primary: '#06b6d4',
    hover: '#0891b2',
    accent: '#67e8f9',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
};

export const FONT_MAP = {
  'Plus Jakarta Sans': "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  'DM Sans': "'DM Sans', sans-serif",
  'Outfit': "'Outfit', sans-serif",
  'Inter': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  'Sora': "'Sora', sans-serif",
  'modern': "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const RADIUS_PRESETS = {
  rounded: { name: 'Modern Rounded', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem' },
  curved: { name: 'Curved Pill', lg: '1.25rem', xl: '1.75rem', '2xl': '2.25rem' },
  sharp: { name: 'Sharp Tech', lg: '0.25rem', xl: '0.375rem', '2xl': '0.5rem' },
};

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  accent: 'blue',
  density: 'comfortable',
  fontFamily: 'Plus Jakarta Sans',
  surfaceStyle: 'glass',
  radiusStyle: 'rounded',
  headerStyle: 'frosted',
  toggleTheme: () => {},
  setTheme: () => {},
  setAccent: () => {},
  setDensity: () => {},
  setFontFamily: () => {},
  setSurfaceStyle: () => {},
  setRadiusStyle: () => {},
  setHeaderStyle: () => {},
  resetAppearance: () => {},
  accentPresets: ACCENT_PRESETS,
  radiusPresets: RADIUS_PRESETS,
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
      return localStorage.getItem('techvick_font') || 'Plus Jakarta Sans';
    } catch {
      return 'Plus Jakarta Sans';
    }
  });

  const [surfaceStyle, setSurfaceStyleState] = useState(() => {
    try {
      return localStorage.getItem('techvick_surface') || 'glass';
    } catch {
      return 'glass';
    }
  });

  const [radiusStyle, setRadiusStyleState] = useState(() => {
    try {
      return localStorage.getItem('techvick_radius') || 'rounded';
    } catch {
      return 'rounded';
    }
  });

  const [headerStyle, setHeaderStyleState] = useState(() => {
    try {
      return localStorage.getItem('techvick_header') || 'frosted';
    } catch {
      return 'frosted';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('techvick_theme', theme);
      localStorage.setItem('techvick_accent', accent);
      localStorage.setItem('techvick_density', density);
      localStorage.setItem('techvick_font', fontFamily);
      localStorage.setItem('techvick_surface', surfaceStyle);
      localStorage.setItem('techvick_radius', radiusStyle);
      localStorage.setItem('techvick_header', headerStyle);
    } catch {}

    const doc = document.documentElement;
    doc.setAttribute('data-theme', theme);
    doc.setAttribute('data-accent', accent);
    doc.setAttribute('data-density', density);
    doc.setAttribute('data-font', fontFamily);
    doc.setAttribute('data-surface', surfaceStyle);
    doc.setAttribute('data-radius', radiusStyle);
    doc.setAttribute('data-header', headerStyle);

    doc.classList.remove('theme-dark', 'theme-light');
    doc.classList.add(`theme-${theme}`);

    // Dynamic Accent Variable Injection
    const currentAccent = ACCENT_PRESETS[accent] || ACCENT_PRESETS.blue;
    doc.style.setProperty('--color-primary', currentAccent.primary);
    doc.style.setProperty('--primary-500', currentAccent.primary);
    doc.style.setProperty('--primary-600', currentAccent.hover);
    doc.style.setProperty('--primary-400', currentAccent.accent);
    doc.style.setProperty('--text-accent', currentAccent.accent);
    doc.style.setProperty('--accent-400', currentAccent.accent);
    doc.style.setProperty('--gradient-primary', currentAccent.gradient);
    doc.style.setProperty('--shadow-glow', `0 0 24px ${currentAccent.glow}`);

    // Dynamic Font Injection
    const fontCSS = FONT_MAP[fontFamily] || `'${fontFamily}', sans-serif`;
    doc.style.setProperty('--font-sans', fontCSS);
    doc.style.setProperty('--font-display', fontCSS);
    if (document.body) {
      document.body.style.fontFamily = fontCSS;
    }

    // Dynamic Corner Radius Injection
    const rad = RADIUS_PRESETS[radiusStyle] || RADIUS_PRESETS.rounded;
    doc.style.setProperty('--radius-lg', rad.lg);
    doc.style.setProperty('--radius-xl', rad.xl);
    doc.style.setProperty('--radius-2xl', rad['2xl']);
  }, [theme, accent, density, fontFamily, surfaceStyle, radiusStyle, headerStyle]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') setThemeState(newTheme);
  };

  const setAccent = (newAccent) => {
    if (ACCENT_PRESETS[newAccent]) {
      setAccentState(newAccent);
    }
  };

  const setDensity = (newDensity) => {
    if (newDensity === 'comfortable' || newDensity === 'compact') {
      setDensityState(newDensity);
    }
  };

  const setFontFamily = (newFont) => {
    if (newFont) {
      setFontFamilyState(newFont);
    }
  };

  const setSurfaceStyle = (newSurface) => {
    if (['glass', 'solid', 'glow'].includes(newSurface)) {
      setSurfaceStyleState(newSurface);
    }
  };

  const setRadiusStyle = (newRadius) => {
    if (['rounded', 'curved', 'sharp'].includes(newRadius)) {
      setRadiusStyleState(newRadius);
    }
  };

  const setHeaderStyle = (newHeader) => {
    if (['frosted', 'solid', 'bordered'].includes(newHeader)) {
      setHeaderStyleState(newHeader);
    }
  };

  const resetAppearance = () => {
    setThemeState('dark');
    setAccentState('blue');
    setDensityState('comfortable');
    setFontFamilyState('Plus Jakarta Sans');
    setSurfaceStyleState('glass');
    setRadiusStyleState('rounded');
    setHeaderStyleState('frosted');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        accent,
        density,
        fontFamily,
        surfaceStyle,
        radiusStyle,
        headerStyle,
        toggleTheme,
        setTheme,
        setAccent,
        setDensity,
        setFontFamily,
        setSurfaceStyle,
        setRadiusStyle,
        setHeaderStyle,
        resetAppearance,
        accentPresets: ACCENT_PRESETS,
        radiusPresets: RADIUS_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
