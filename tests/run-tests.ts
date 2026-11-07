import { packGangSheetMaxRects } from '../src/features/production/algorithms/maxrects-packer';
import { applyThresholdFilter } from '../src/features/production/algorithms/threshold-filter';
import { applyKnockoutFilter } from '../src/features/production/algorithms/knockout-filter';
import { GangSheetRoll, GangSheetItemInput } from '../src/types/production';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('--- RUNNING STARTTHEBRAND ALGORITHM & PRODUCTION TESTS ---');

// 1. MaxRects 2D Bin Packing Test
console.log('\n[1] MaxRects Bin Packing Algorithm:');
const testRoll: GangSheetRoll = {
  widthInches: 22,
  lengthInches: 36,
  marginInches: 0.25,
  spacingInches: 0.25,
};

const testItems: GangSheetItemInput[] = [
  {
    id: 'test-1',
    designName: 'Front Chest Graphic',
    imageUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    widthInches: 10,
    heightInches: 6,
    quantity: 2,
    allowRotation: true,
  },
  {
    id: 'test-2',
    designName: 'Back Silhouette Graphic',
    imageUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    widthInches: 12,
    heightInches: 14,
    quantity: 1,
    allowRotation: false,
  },
];

const packResult = packGangSheetMaxRects(testRoll, testItems);
assert(packResult.placements.length === 3, 'Packed all 3 item instances without loss');
assert(packResult.materialEfficiencyPercent > 0, `Computed positive material efficiency (${packResult.materialEfficiencyPercent}%)`);
assert(packResult.totalUsedLengthInches <= 36, `Total used length (${packResult.totalUsedLengthInches}") is within 36" roll boundary`);
assert(!packResult.hasCollisions, 'No placement collisions or boundary overflows detected');

// Verify non-overlapping coordinates
for (let i = 0; i < packResult.placements.length; i++) {
  const p1 = packResult.placements[i];
  for (let j = i + 1; j < packResult.placements.length; j++) {
    const p2 = packResult.placements[j];
    const overlaps =
      p1.xInches < p2.xInches + p2.widthInches &&
      p1.xInches + p1.widthInches > p2.xInches &&
      p1.yInches < p2.yInches + p2.heightInches &&
      p1.yInches + p1.heightInches > p2.yInches;
    assert(!overlaps, `Placement ${p1.designName} (#${p1.instanceIndex}) does not overlap with ${p2.designName} (#${p2.instanceIndex})`);
  }
}

// 2. Color Threshold Filter Test
console.log('\n[2] Color Threshold (1-Bit Film Positive) Filter:');
const dummyImageData: any = {
  data: new Uint8ClampedArray([
    // Pixel 1: Dark gray (lum ~50) -> should be pure black (0)
    50, 50, 50, 255,
    // Pixel 2: Bright white (lum ~240) -> should be pure white (255)
    240, 240, 240, 255,
  ]),
};

applyThresholdFilter(dummyImageData, { cutoff: 128, invert: false });
assert(dummyImageData.data[0] === 0, 'Dark pixel thresholded to pure black (0)');
assert(dummyImageData.data[4] === 255, 'Light pixel thresholded to pure white (255)');

// 3. Euclidean Delta Knockout Color Test
console.log('\n[3] Knockout Color Background Removal Filter:');
const knockoutImageData: any = {
  data: new Uint8ClampedArray([
    // Pixel 1: Pure pitch black (matches #0B0B0D with low delta)
    11, 11, 13, 255,
    // Pixel 2: Bright neon volt (#E2F952: R226, G249, B82) -> high delta
    226, 249, 82, 255,
  ]),
};

applyKnockoutFilter(knockoutImageData, {
  targetHex: '#0B0B0D',
  tolerance: 30,
  feather: 0,
});

assert(knockoutImageData.data[3] === 0, 'Matching background color pixel alpha knocked out to 0 (transparent)');
assert(knockoutImageData.data[7] === 255, 'Foreground volt accent pixel alpha preserved at 255 (opaque)');

console.log('\n======================================================');
console.log('ALL UNIT & ALGORITHM VERIFICATION TESTS PASSED (100%)');
console.log('======================================================\n');
