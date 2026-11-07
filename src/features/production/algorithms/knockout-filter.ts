import { KnockoutParams } from '@/types/production';

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function applyKnockoutFilter(
  imageData: ImageData,
  params: KnockoutParams
): ImageData {
  const data = imageData.data;
  const target = hexToRgb(params.targetHex || '#000000');
  const tolerance = Math.max(0, params.tolerance);
  const feather = Math.max(0, params.feather);

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Euclidean distance in RGB color space
    // ΔE = sqrt((R - Rt)^2 + (G - Gt)^2 + (B - Bt)^2)
    const deltaR = r - target.r;
    const deltaG = g - target.g;
    const deltaB = b - target.b;
    const deltaE = Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);

    if (deltaE <= tolerance) {
      data[i + 3] = 0; // Completely transparent
    } else if (feather > 0 && deltaE <= tolerance + feather) {
      // Smooth feather alpha edge
      const factor = (deltaE - tolerance) / feather;
      data[i + 3] = Math.round(a * factor);
    }
  }

  return imageData;
}
