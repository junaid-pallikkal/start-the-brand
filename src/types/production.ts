export interface GangSheetRoll {
  widthInches: 22 | 24;
  lengthInches: number; // 12" to 120"
  marginInches: number; // e.g. 0.25"
  spacingInches: number; // e.g. 0.25"
}

export interface GangSheetItemInput {
  id: string;
  designName: string;
  imageUrl: string;
  widthInches: number;
  heightInches: number;
  quantity: number;
  allowRotation: boolean;
}

export interface PackedPlacement {
  itemId: string;
  designName: string;
  imageUrl: string;
  instanceIndex: number;
  xInches: number;
  yInches: number;
  widthInches: number;
  heightInches: number;
  isRotated: boolean;
}

export interface GangSheetResult {
  roll: GangSheetRoll;
  placements: PackedPlacement[];
  materialEfficiencyPercent: number;
  totalUsedLengthInches: number;
  hasCollisions: boolean;
}

export interface HalftoneParams {
  dotSize: number; // 2 to 20 px
  angle: number; // 0 to 90 degrees
  contrast: number; // -100 to 100
  brightness: number; // -100 to 100
  shape: 'round' | 'ellipse' | 'square';
  transparentThreshold: number; // 0 to 255
}

export interface ThresholdParams {
  cutoff: number; // 0 to 255
  invert: boolean;
}

export interface KnockoutParams {
  targetHex: string;
  tolerance: number; // 0 to 255
  feather: number; // 0 to 10
}
