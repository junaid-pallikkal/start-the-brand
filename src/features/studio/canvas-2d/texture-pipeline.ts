import { SurfaceType } from '@/types/garment';
import { DesignLayer, ImageLayer, TextLayer, StudioProject } from '@/types/studio';

class TexturePipeline {
  private offscreenCanvases: Map<SurfaceType, HTMLCanvasElement> = new Map();
  private imageCache: Map<string, HTMLImageElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      const surfaces: SurfaceType[] = ['FRONT', 'BACK', 'LEFT_SLEEVE', 'RIGHT_SLEEVE'];
      surfaces.forEach((surface) => {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        this.offscreenCanvases.set(surface, canvas);
      });
    }
  }

  public getCanvas(surface: SurfaceType): HTMLCanvasElement | null {
    if (typeof window === 'undefined') return null;
    let canvas = this.offscreenCanvases.get(surface);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      this.offscreenCanvases.set(surface, canvas);
    }
    return canvas;
  }

  public async renderSurface(
    surface: SurfaceType,
    layers: DesignLayer[],
    garmentColor?: string,
    drawGarmentBg = false
  ): Promise<HTMLCanvasElement> {
    const canvas = this.getCanvas(surface);
    if (!canvas) throw new Error('Canvas not available');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not available');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (drawGarmentBg && garmentColor) {
      ctx.fillStyle = garmentColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Sort layers by zIndex ascending
    const sortedLayers = [...layers].filter((l) => l.isVisible).sort((a, b) => a.zIndex - b.zIndex);

    for (const layer of sortedLayers) {
      ctx.save();

      // Percentage to 2048x2048 coordinate space
      const centerX = (layer.x / 100) * canvas.width;
      const centerY = (layer.y / 100) * canvas.height;
      const layerWidthPx = (layer.width / 100) * canvas.width * layer.scaleX;
      const layerHeightPx = (layer.height / 100) * canvas.height * layer.scaleY;

      ctx.translate(centerX, centerY);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));

      if (layer.type === 'TEXT') {
        const textLayer = layer as TextLayer;
        const fontSizePx = Math.max(
          16,
          (textLayer.fontSize / 1000) * canvas.width * layer.scaleY
        );

        // Sanitize font family name for Canvas 2D
        const cleanFont = (textLayer.fontFamily || 'Impact')
          .replace(/['"]/g, '')
          .split(',')[0]
          .trim();

        ctx.font = `${textLayer.fontWeight || 'bold'} ${Math.round(fontSizePx)}px "${cleanFont}", sans-serif`;
        ctx.fillStyle = textLayer.fillColor || '#FFFFFF';
        ctx.textAlign = (textLayer.textAlign as CanvasTextAlign) || 'center';
        ctx.textBaseline = 'middle';

        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = `${textLayer.letterSpacing || 0}px`;
        }

        ctx.fillText(textLayer.text, 0, 0);
      } else if (layer.type === 'IMAGE') {
        const imgLayer = layer as ImageLayer;
        let img = this.imageCache.get(imgLayer.src);

        if (!img) {
          img = await this.loadImage(imgLayer.src);
          this.imageCache.set(imgLayer.src, img);
        }

        if (img) {
          const drawX = -layerWidthPx / 2;
          const drawY = -layerHeightPx / 2;
          ctx.drawImage(img, drawX, drawY, layerWidthPx, layerHeightPx);
        }
      }

      ctx.restore();
    }

    return canvas;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        resolve(new Image());
      };
      img.src = src;
    });
  }

  public exportHighResPNG(surface: SurfaceType, layers: DesignLayer[]): string {
    const canvas = this.getCanvas(surface);
    if (!canvas) return '';
    return canvas.toDataURL('image/png', 1.0);
  }
}

export const texturePipeline = new TexturePipeline();
