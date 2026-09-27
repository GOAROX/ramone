/**
 * Ramone color variant definitions
 * Inspired by the iconic paint jobs of the Ramone character from Cars
 */

export interface RamoneColorVariant {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // Core accent colors
  primary: string;
  primaryPressed: string;
  primaryLight: string;
  primaryLighter: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  // Fixed structural colors
  background: string;
  cardBackground: string;
  cardBorder: string;
  cardBorderHover: string;
  coral: string;
  coralLight: string;
  coralBorder: string;
  purple: string;
  purpleLight: string;
  peach: string;
  peachLight: string;
  teal: string;
  tealLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  divider: string;
  chanceHigh: string;
  chanceMedium: string;
  chanceLow: string;
}

function buildVariant(
  id: string,
  name: string,
  emoji: string,
  description: string,
  primary: string,
  primaryPressed: string,
  primaryLight: string,
  primaryLighter: string,
  primaryDark: string,
  secondary: string,
  secondaryLight: string
): RamoneColorVariant {
  return {
    id,
    name,
    emoji,
    description,
    primary,
    primaryPressed,
    primaryLight,
    primaryLighter,
    primaryDark,
    secondary,
    secondaryLight,
    // Structural (shared across all themes)
    background: '#FAF7F8',
    cardBackground: '#FFFFFF',
    cardBorder: '#F0EBF0',
    cardBorderHover: '#E2DAE2',
    coral: primary,
    coralLight: primaryLight,
    coralBorder: primaryLight,
    purple: secondary,
    purpleLight: secondaryLight,
    peach: '#FF976A',
    peachLight: '#FFF1EB',
    teal: '#34A0A4',
    tealLight: '#E8F7F7',
    textPrimary: '#1E1A1E',
    textSecondary: '#6D646D',
    textMuted: '#A09AA0',
    divider: '#EDE7ED',
    chanceHigh: primary,
    chanceMedium: '#FFA043',
    chanceLow: '#6CC24A',
  };
}

export const RAMONE_VARIANTS: RamoneColorVariant[] = [
  buildVariant(
    'roses',
    'Roses (Default)',
    '🌹',
    'Classic soft coral & rose, inspired by Flo\'s diner',
    '#FF647C',
    '#E8526A',
    '#FFE8ED',
    '#FFF2F5',
    '#D8415C',
    '#8C6BE6',
    '#F3EEFF'
  ),
  buildVariant(
    'purple_flames',
    'Purple with Flames',
    '🔥',
    'Deep metallic purple with flame orange — Ramone\'s iconic look',
    '#4A283B',
    '#3A1F2E',
    '#EBD4E2',
    '#F5E9F0',
    '#321624',
    '#EB793D',
    '#FDE8D4'
  ),
  buildVariant(
    'hunter_green',
    'Dark Green / Grass Green',
    '🌿',
    'Deep hunter green with lime pinstripe detailing',
    '#2B3E2D',
    '#1E2E20',
    '#C8D9CA',
    '#E0EDE1',
    '#1A2B1C',
    '#76B852',
    '#DAEECB'
  ),
  buildVariant(
    'mellow_sunset',
    'Yellow / Mellow Sunset',
    '🌅',
    'Mellow yellow body with sunset orange gradient',
    '#D4A017',
    '#B8890C',
    '#FDF2C0',
    '#FEFADF',
    '#A37810',
    '#E67E22',
    '#FDEBD0'
  ),
  buildVariant(
    'candy_red',
    'Red / Hydraulic',
    '❤️',
    'Candy apple red with bright hydraulic highlights',
    '#A61C1C',
    '#8B1616',
    '#F4C4C4',
    '#FAEAEA',
    '#7A1515',
    '#D93B3A',
    '#F8D7D7'
  ),
  buildVariant(
    'lightning',
    'Red and Yellow / Lightning',
    '⚡',
    'Crimson base with electric yellow lightning accents',
    '#B82626',
    '#9E2020',
    '#F4CBCB',
    '#FAEBEB',
    '#8A1C1C',
    '#F1C40F',
    '#FEF9C3'
  ),
  buildVariant(
    'ghostlight',
    'Light Blue / Ghostlight',
    '👻',
    'Electric blue with ethereal ghostlight glow',
    '#01ACE4',
    '#0191C0',
    '#C5EDF9',
    '#E0F6FD',
    '#0183AD',
    '#C5E4E6',
    '#E8F7F8'
  ),
  buildVariant(
    'body_shop',
    'Lime Green / Body Shop',
    '💚',
    'Neon lime green with deep green shadowing',
    '#5CAD00',
    '#4E9800',
    '#D4F5A0',
    '#EAFBCE',
    '#3E8000',
    '#458B00',
    '#C5E4A0'
  ),
  buildVariant(
    'union_jack',
    'Union Jack',
    '🇬🇧',
    'British royal blue with union jack red and white',
    '#00247D',
    '#001E68',
    '#BACDE6',
    '#D9E5F3',
    '#001660',
    '#CF142B',
    '#F9C9CE'
  ),
  buildVariant(
    'florida',
    'White and Red / Florida',
    '🌴',
    'Baby powder white body with racing red trim',
    '#D93B3A',
    '#BF2F2E',
    '#FADADB',
    '#FDEEEE',
    '#A52829',
    '#FEFEFA',
    '#F8F8F5'
  ),
];

export const DEFAULT_VARIANT_ID = 'roses';

export function getVariantById(id: string): RamoneColorVariant {
  return RAMONE_VARIANTS.find((v) => v.id === id) ?? RAMONE_VARIANTS[0];
}
