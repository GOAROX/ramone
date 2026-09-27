/**
 * Ramone theme tokens and styling constants
 */
export const RamoneTheme = {
  colors: {
    background: '#FAF7F8',
    cardBackground: '#FFFFFF',
    cardBorder: '#F0E6EC',
    cardBorderHover: '#E7D5E0',

    // Primary coral / rose highlights
    primary: '#FF647C',
    primaryPressed: '#E8526A',
    primaryLight: '#FFE8ED',
    primaryLighter: '#FFF2F5',
    primaryDark: '#D8415C',

    // Secondary & phase accents
    coral: '#FF6B81',
    coralLight: '#FFF0F3',
    coralBorder: '#FFD3DC',

    purple: '#8C6BE6',
    purpleLight: '#F3EEFF',
    peach: '#FF976A',
    peachLight: '#FFF1EB',
    teal: '#34A0A4',
    tealLight: '#E8F7F7',

    // Text & neutral colors
    textPrimary: '#2C2229',
    textSecondary: '#7F727B',
    textMuted: '#A69BA3',
    divider: '#EFE7EB',

    // Pregnancy chance indicators
    chanceHigh: '#FF647C',
    chanceMedium: '#FFA043',
    chanceLow: '#6CC24A',
  },
  shadows: {
    card: {
      shadowColor: '#301C24',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    heroCircle: {
      shadowColor: '#FF647C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 22,
      elevation: 6,
    },
    primaryButton: {
      shadowColor: '#FF647C',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
  },
} as const;
