export interface TypographyPreset {
  id: string;
  name: string;
  fontFamily: string;
  category: 'brutalist' | 'gothic' | 'editorial' | 'sans' | 'display';
  defaultLetterSpacing: number;
  previewText: string;
}

export const STREETWEAR_FONTS: TypographyPreset[] = [
  {
    id: 'font-impact',
    name: 'HEAVY IMPACT',
    fontFamily: 'Impact, sans-serif',
    category: 'brutalist',
    defaultLetterSpacing: 1,
    previewText: 'OBSIDIAN',
  },
  {
    id: 'font-courier',
    name: 'TACTICAL MONO',
    fontFamily: '"Courier New", Courier, monospace',
    category: 'brutalist',
    defaultLetterSpacing: 2,
    previewText: 'STB-SPEC-01',
  },
  {
    id: 'font-trebuchet',
    name: 'STREET CONDENSED',
    fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", sans-serif',
    category: 'display',
    defaultLetterSpacing: 4,
    previewText: 'NEW WORLD ORDER',
  },
  {
    id: 'font-georgia',
    name: 'EDITORIAL SERIF',
    fontFamily: 'Georgia, serif',
    category: 'editorial',
    defaultLetterSpacing: 1,
    previewText: 'Atelier Brand',
  },
  {
    id: 'font-arial-black',
    name: 'NEO BRUTALIST',
    fontFamily: '"Arial Black", Gadget, sans-serif',
    category: 'brutalist',
    defaultLetterSpacing: -1,
    previewText: 'RAW ARCHIVE',
  },
  {
    id: 'font-lucida',
    name: 'Y2K FUTURA',
    fontFamily: '"Lucida Console", Monaco, monospace',
    category: 'display',
    defaultLetterSpacing: 3,
    previewText: 'CYBER-CORE 2026',
  },
];
