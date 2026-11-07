export type SurfaceType = 'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE';

export type GarmentCategory = 
  | 'OVERSIZED_TEE'
  | 'REGULAR_TEE'
  | 'HEAVYWEIGHT_HOODIE'
  | 'CREWNECK_SWEATSHIRT'
  | 'BASKETBALL_JERSEY'
  | 'FLEECE_SHORTS'
  | 'WIDE_LEG_CARGO_PANTS'
  | 'HEAVYWEIGHT_SWEATPANTS'
  | 'RELAXED_DENIM_JEANS'
  | 'CREW_SOCKS';

export interface UVZoneDefinition {
  surface: SurfaceType;
  uvBounds: { uMin: number; uMax: number; vMin: number; vMax: number };
  printableAreaInches: { width: number; height: number };
  canvasPixelDimensions: { width: number; height: number }; // 2048x2048 standard
}

export interface GarmentSilhouette {
  id: string;
  category: GarmentCategory;
  name: string;
  shortName: string;
  description: string;
  baseCostUSD: number;
  availableColors: { name: string; hex: string }[];
  modelPath: string; // GLB path or procedural identifier
  geometryType: 'tshirt' | 'hoodie' | 'sweatshirt' | 'jersey' | 'shorts' | 'cargos' | 'sweatpants' | 'jeans' | 'socks';
  uvZones: Record<SurfaceType, UVZoneDefinition>;
}
