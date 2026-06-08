import React, { createContext, useContext, useState } from 'react';

// ─── Theme definitions ────────────────────────────────────────────────────────

export type ThemeName = 'light' | 'dark' | 'ocean' | 'forest';

export interface Theme {
  name: ThemeName;
  label: string;
  // Backgrounds
  bg: string;
  bgCard: string;
  bgInput: string;
  bgSection: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  // Borders
  border: string;
  borderFocus: string;
  // Accent (primary action colour)
  accent: string;
  accentLight: string;
  accentText: string;
  // Drawer
  drawerBg: string;
  drawerBorder: string;
  // Status bar
  statusBar: 'dark-content' | 'light-content';
}

const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    label: 'Light',
    bg: '#f8fafc',
    bgCard: '#ffffff',
    bgInput: '#ffffff',
    bgSection: '#ffffff',
    textPrimary: '#1e3a5f',
    textSecondary: '#374151',
    textMuted: '#9ca3af',
    textInverse: '#ffffff',
    border: '#e5e7eb',
    borderFocus: '#3b82f6',
    accent: '#3b82f6',
    accentLight: '#eff6ff',
    accentText: '#2563eb',
    drawerBg: '#ffffff',
    drawerBorder: '#f1f5f9',
    statusBar: 'dark-content',
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    bg: '#0f172a',
    bgCard: '#1e293b',
    bgInput: '#1e293b',
    bgSection: '#1e293b',
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    textInverse: '#0f172a',
    border: '#334155',
    borderFocus: '#60a5fa',
    accent: '#60a5fa',
    accentLight: '#1e3a5f',
    accentText: '#93c5fd',
    drawerBg: '#1e293b',
    drawerBorder: '#334155',
    statusBar: 'light-content',
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    bg: '#0c1445',
    bgCard: '#162060',
    bgInput: '#1a2570',
    bgSection: '#162060',
    textPrimary: '#e0f2fe',
    textSecondary: '#bae6fd',
    textMuted: '#7dd3fc',
    textInverse: '#0c1445',
    border: '#1e40af',
    borderFocus: '#38bdf8',
    accent: '#38bdf8',
    accentLight: '#0c2a5c',
    accentText: '#7dd3fc',
    drawerBg: '#0f1f5c',
    drawerBorder: '#1e3a8a',
    statusBar: 'light-content',
  },
  forest: {
    name: 'forest',
    label: 'Forest',
    bg: '#0a1f0a',
    bgCard: '#14321a',
    bgInput: '#1a3d20',
    bgSection: '#14321a',
    textPrimary: '#dcfce7',
    textSecondary: '#bbf7d0',
    textMuted: '#6ee7b7',
    textInverse: '#0a1f0a',
    border: '#166534',
    borderFocus: '#34d399',
    accent: '#34d399',
    accentLight: '#052e16',
    accentText: '#6ee7b7',
    drawerBg: '#0f2b14',
    drawerBorder: '#14532d',
    statusBar: 'light-content',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  allThemes: Theme[];
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const setTheme = (name: ThemeName) => setThemeName(name);

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeName],
        themeName,
        allThemes: Object.values(themes),
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
