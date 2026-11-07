export type CameraPreset = 'hero' | 'isometric' | 'graphic' | 'back' | 'macro';

export type EnvironmentPreset = 'studio_clean' | 'obsidian_dark' | 'urban_street' | 'minimal_gray' | 'high_contrast';

export interface PBRProperties {
  roughness: number;
  metalness: number;
  sheen: number;
  normalScale: number;
}

export interface SavedMockup {
  id: string;
  projectId: string;
  title: string;
  garmentName: string;
  garmentColor: string;
  cameraPreset: CameraPreset;
  environmentPreset: EnvironmentPreset;
  imageUrl: string;
  createdAt: string;
}
