import { HalftoneParams } from '@/types/production';

export function applyHalftoneFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: HalftoneParams
): void {
  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;

  // Clear target context
  ctx.clearRect(0, 0, width, height);

  const dotSize = Math.max(2, params.dotSize);
  const angleRad = (params.angle * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  ctx.fillStyle = '#000000';

  // Sample grid
  for (let y = 0; y < height; y += dotSize) {
    for (let x = 0; x < width; x += dotSize) {
      // Rotate coordinates to check grid
      const rx = Math.floor(x * cos - y * sin);
      const ry = Math.floor(x * sin + y * cos);

      // Average brightness in the cell
      let totalLuminance = 0;
      let count = 0;
      let totalAlpha = 0;

      for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const a = src[idx + 3];
          if (a > 20) {
            const r = src[idx];
            const g = src[idx + 1];
            const b = src[idx + 2];
            // Standard perceptual luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuminance += lum;
            totalAlpha += a;
            count++;
          }
        }
      }

      if (count > 0 && totalAlpha / count > params.transparentThreshold) {
        const avgLum = totalLuminance / count;
        // Invert luminance so darker areas produce larger ink dots
        const darkness = 1 - avgLum / 255;
        const radius = (dotSize / 2) * darkness * (1 + params.contrast / 100);

        if (radius > 0.5) {
          ctx.beginPath();
          if (params.shape === 'ellipse') {
            ctx.ellipse(
              x + dotSize / 2,
              y + dotSize / 2,
              radius,
              radius * 0.7,
              angleRad,
              0,
              Math.PI * 2
            );
          } else if (params.shape === 'square') {
            ctx.rect(
              x + dotSize / 2 - radius,
              y + dotSize / 2 - radius,
              radius * 2,
              radius * 2
            );
          } else {
            ctx.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
    }
  }
}
