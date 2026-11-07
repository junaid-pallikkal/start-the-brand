import { SurfaceType } from './garment';

export type LayerType = 'IMAGE' | 'TEXT' | 'SHAPE';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  surface: SurfaceType;
  x: number; // percentage of canvas (0 to 100)
  y: number; // percentage of canvas (0 to 100)
  width: number; // percentage of canvas
  height: number; // percentage of canvas
  rotation: number; // degrees 0-360
  scaleX: number;
  scaleY: number;
  opacity: number; // 0 to 1
  isLocked: boolean;
  isVisible: boolean;
  zIndex: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'IMAGE';
  src: string; // Data URL or storage URL
  originalWidth: number;
  originalHeight: number;
  filterMode?: 'ORIGINAL' | 'HALFTONE' | 'THRESHOLD' | 'KNOCKOUT';
}

export interface TextLayer extends BaseLayer {
  type: 'TEXT';
  text: string;
  fontFamily: string;
  fontSize: number;
  fillColor: string;
  letterSpacing: number;
  lineHeight: number;
  fontWeight: string | number;
  textAlign: 'left' | 'center' | 'right';
  isCurved?: boolean;
  curveRadius?: number;
}

export type DesignLayer = ImageLayer | TextLayer;

export interface StudioProject {
  id: string;
  userId?: string;
  name: string;
  garmentId: string;
  garmentColor: string;
  layers: Record<SurfaceType, DesignLayer[]>;
  updatedAt: string;
  createdAt: string;
}
