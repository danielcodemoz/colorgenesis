export interface Color {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  frequency: number;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  createdAt: Date;
  imageUrl?: string;
}

export interface ColorHarmony {
  type: 'complementary' | 'analogous' | 'triadic' | 'monochromatic';
  colors: string[];
}

export type Language = 'en' | 'pt';

export type Theme = 'gradient' | 'dark' | 'light' | 'ocean' | 'sunset';

export interface Translations {
  [key: string]: {
    en: string;
    pt: string;
  };
}

export interface ThemeConfig {
  name: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  buttonPrimary: string;
  buttonSecondary: string;
}