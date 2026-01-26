export const COLORS = {
  // --- CORE PALETTE ---
  // Deep, rich primary for trust and calm (Inspiration: "Christian Dating" deep blue)
  primary: '#1A2F4B',
  primaryLight: '#2C4A73',

  // Elegant Accent (Gold/Amber - retained but refined)
  accent: '#D4AF37',
  accentLight: '#F3E5AB', // Champagne

  // --- BACKGROUNDS ---
  // Clean, modern foundation
  background: '#F8F9FB', // Cool light gray/blue tint
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F2F5',

  // --- TYPOGRAPHY ---
  text: '#121212', // Soft black
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // --- UTILITY ---
  border: '#E1E4E8',
  success: '#2E7D32',
  error: '#D32F2F',
  warning: '#ED6C02',

  // --- OVERLAYS ---
  modalBackdrop: 'rgba(26, 47, 75, 0.4)', // Tinted backdrop
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const ALERTS = {
  // Soft, diffuse shadows for "floating" feel
  shadow: {
    shadowColor: '#1A2F4B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowSm: {
    shadowColor: '#1A2F4B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};
