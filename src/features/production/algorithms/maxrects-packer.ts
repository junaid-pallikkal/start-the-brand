import {
  GangSheetRoll,
  GangSheetItemInput,
  PackedPlacement,
  GangSheetResult,
} from '@/types/production';

interface FreeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function packGangSheetMaxRects(
  roll: GangSheetRoll,
  items: GangSheetItemInput[]
): GangSheetResult {
  const margin = roll.marginInches ?? 0.25;
  const spacing = roll.spacingInches ?? 0.25;

  const usableWidth = roll.widthInches - margin * 2;
  const maxAvailableLength = roll.lengthInches - margin * 2;

  // Flatten items by quantity
  const flatItems: {
    item: GangSheetItemInput;
    instanceIndex: number;
    w: number;
    h: number;
  }[] = [];

  items.forEach((item) => {
    for (let q = 0; q < item.quantity; q++) {
      flatItems.push({
        item,
        instanceIndex: q + 1,
        w: item.widthInches,
        h: item.heightInches,
      });
    }
  });

  // Sort descending by area (Best Area Fit heuristic)
  flatItems.sort((a, b) => b.w * b.h - a.w * a.h);

  // Initialize free rectangles
  let freeRects: FreeRect[] = [
    {
      x: 0,
      y: 0,
      width: usableWidth,
      height: maxAvailableLength,
    },
  ];

  const placements: PackedPlacement[] = [];
  let maxYUsed = 0;
  let hasCollisions = false;

  for (const { item, instanceIndex, w, h } of flatItems) {
    let bestRectIndex = -1;
    let bestShortSideFit = Number.MAX_VALUE;
    let isRotated = false;

    // Check normal orientation and 90-degree rotated orientation
    for (let i = 0; i < freeRects.length; i++) {
      const rect = freeRects[i];

      // Normal orientation
      if (w <= rect.width && h <= rect.height) {
        const leftoverX = rect.width - w;
        const leftoverY = rect.height - h;
        const shortSideFit = Math.min(leftoverX, leftoverY);

        if (shortSideFit < bestShortSideFit) {
          bestShortSideFit = shortSideFit;
          bestRectIndex = i;
          isRotated = false;
        }
      }

      // Rotated orientation if allowed
      if (item.allowRotation && h <= rect.width && w <= rect.height) {
        const leftoverX = rect.width - h;
        const leftoverY = rect.height - w;
        const shortSideFit = Math.min(leftoverX, leftoverY);

        if (shortSideFit < bestShortSideFit) {
          bestShortSideFit = shortSideFit;
          bestRectIndex = i;
          isRotated = true;
        }
      }
    }

    if (bestRectIndex === -1) {
      // Could not fit within roll boundaries without collision
      hasCollisions = true;
      continue;
    }

    const targetRect = freeRects[bestRectIndex];
    const placedWidth = isRotated ? h : w;
    const placedHeight = isRotated ? w : h;

    const placedX = targetRect.x;
    const placedY = targetRect.y;

    placements.push({
      itemId: item.id,
      designName: item.designName,
      imageUrl: item.imageUrl,
      instanceIndex,
      xInches: parseFloat((placedX + margin).toFixed(2)),
      yInches: parseFloat((placedY + margin).toFixed(2)),
      widthInches: parseFloat(placedWidth.toFixed(2)),
      heightInches: parseFloat(placedHeight.toFixed(2)),
      isRotated,
    });

    const usedY = placedY + placedHeight;
    if (usedY > maxYUsed) {
      maxYUsed = usedY;
    }

    // Split free rectangles by the placed item + spacing
    const occupiedWidth = placedWidth + spacing;
    const occupiedHeight = placedHeight + spacing;

    const newFreeRects: FreeRect[] = [];

    for (const rect of freeRects) {
      // Check intersection
      const intersectX = Math.max(rect.x, placedX);
      const intersectY = Math.max(rect.y, placedY);
      const intersectR = Math.min(rect.x + rect.width, placedX + occupiedWidth);
      const intersectB = Math.min(rect.y + rect.height, placedY + occupiedHeight);

      if (intersectX >= intersectR || intersectY >= intersectB) {
        // No intersection, keep rectangle
        newFreeRects.push(rect);
        continue;
      }

      // Split into 4 potential sub-rectangles: Top, Bottom, Left, Right
      if (placedY > rect.y && placedY < rect.y + rect.height) {
        newFreeRects.push({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: placedY - rect.y,
        });
      }

      if (placedY + occupiedHeight < rect.y + rect.height) {
        newFreeRects.push({
          x: rect.x,
          y: placedY + occupiedHeight,
          width: rect.width,
          height: rect.y + rect.height - (placedY + occupiedHeight),
        });
      }

      if (placedX > rect.x && placedX < rect.x + rect.width) {
        newFreeRects.push({
          x: rect.x,
          y: rect.y,
          width: placedX - rect.x,
          height: rect.height,
        });
      }

      if (placedX + occupiedWidth < rect.x + rect.width) {
        newFreeRects.push({
          x: placedX + occupiedWidth,
          y: rect.y,
          width: rect.x + rect.width - (placedX + occupiedWidth),
          height: rect.height,
        });
      }
    }

    // Prune redundant/contained rectangles
    freeRects = pruneFreeRectangles(newFreeRects);
  }

  const totalUsedLength = Math.max(maxYUsed + margin, 12);

  // Calculate material efficiency %
  const totalItemArea = placements.reduce(
    (sum, p) => sum + p.widthInches * p.heightInches,
    0
  );
  const totalRollArea = roll.widthInches * totalUsedLength;
  const efficiency =
    totalRollArea > 0 ? (totalItemArea / totalRollArea) * 100 : 0;

  return {
    roll,
    placements,
    materialEfficiencyPercent: parseFloat(efficiency.toFixed(1)),
    totalUsedLengthInches: parseFloat(totalUsedLength.toFixed(1)),
    hasCollisions,
  };
}

function pruneFreeRectangles(rects: FreeRect[]): FreeRect[] {
  const result: FreeRect[] = [];

  for (let i = 0; i < rects.length; i++) {
    const a = rects[i];
    let isContained = false;

    for (let j = 0; j < rects.length; j++) {
      if (i === j) continue;
      const b = rects[j];

      if (
        a.x >= b.x &&
        a.y >= b.y &&
        a.x + a.width <= b.x + b.width &&
        a.y + a.height <= b.y + b.height
      ) {
        isContained = true;
        break;
      }
    }

    if (!isContained && a.width > 0.5 && a.height > 0.5) {
      result.push(a);
    }
  }

  return result;
}
