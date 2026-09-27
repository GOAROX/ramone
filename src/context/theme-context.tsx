import React, { createContext, useContext, useState, useCallback } from 'react';
import type { RamoneColorVariant } from '@/constants/color-variants';
import { DEFAULT_VARIANT_ID, getVariantById } from '@/constants/color-variants';

interface ThemeContextValue {
  variantId: string;
  colors: RamoneColorVariant;
  shadows: {
    card: object;
    heroCircle: object;
    primaryButton: object;
  };
  setVariant: (id: string) => void;
}

function buildShadows(primary: string) {
  return {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    heroCircle: {
      shadowColor: primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 22,
      elevation: 6,
    },
    primaryButton: {
      shadowColor: primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function RamoneThemeProvider({ children }: { children: React.ReactNode }) {
  const [variantId, setVariantId] = useState(DEFAULT_VARIANT_ID);

  const setVariant = useCallback((id: string) => {
    setVariantId(id);
  }, []);

  const colors = getVariantById(variantId);
  const shadows = buildShadows(colors.primary);

  return (
    <ThemeContext.Provider value={{ variantId, colors, shadows, setVariant }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useRamoneTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback to default theme (for components used outside provider)
    const colors = getVariantById(DEFAULT_VARIANT_ID);
    return {
      variantId: DEFAULT_VARIANT_ID,
      colors,
      shadows: buildShadows(colors.primary),
      setVariant: () => {},
    };
  }
  return ctx;
}
