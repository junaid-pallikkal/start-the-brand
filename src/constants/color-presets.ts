export interface ColorPreset {
  name: string;
  hex: string;
  category: 'core' | 'earth' | 'street' | 'pastel';
}

export const APPAREL_COLOR_PRESETS: ColorPreset[] = [
  // Core
  { name: 'Pitch Black', hex: '#0B0B0D', category: 'core' },
  { name: 'Vintage Washed Black', hex: '#1F2023', category: 'core' },
  { name: 'Optic White', hex: '#FFFFFF', category: 'core' },
  { name: 'Natural Bone Cream', hex: '#F0ECE1', category: 'core' },
  { name: 'Heather Gray', hex: '#8C8D91', category: 'core' },
  { name: 'Anthracite Charcoal', hex: '#34373E', category: 'core' },

  // Street & Accents
  { name: 'Electric Volt Lime', hex: '#E2F952', category: 'street' },
  { name: 'International Orange', hex: '#FF4800', category: 'street' },
  { name: 'Acid Cyber Cyan', hex: '#00F0FF', category: 'street' },
  { name: 'Cobalt Royal Blue', hex: '#1E40AF', category: 'street' },
  { name: 'Crimson Scarlet', hex: '#DC2626', category: 'street' },

  // Earth Tones
  { name: 'Mocha Chocolate', hex: '#3E2723', category: 'earth' },
  { name: 'Washed Olive Drab', hex: '#4B5320', category: 'earth' },
  { name: 'Desert Sand Dune', hex: '#C2B280', category: 'earth' },
  { name: 'Forest Moss Green', hex: '#1C352D', category: 'earth' },
  { name: 'Raw Ochre Clay', hex: '#8D5B4C', category: 'earth' },
];

export const DEFAULT_GARMENT_COLOR = '#0B0B0D';
