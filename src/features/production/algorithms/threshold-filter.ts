import { ThresholdParams } from '@/types/production';

export function applyThresholdFilter(
  imageData: ImageData,
  params: ThresholdParams
): ImageData {
  const data = imageData.data;
  const cutoff = params.cutoff;
  const invert = params.invert;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 10) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Standard grayscale conversion
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    let isBlack: boolean;
    if (invert) {
      isBlack = gray >= cutoff;
    } else {
      isBlack = gray < cutoff;
    }

    const val = isBlack ? 0 : 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }

  return imageData;
}
