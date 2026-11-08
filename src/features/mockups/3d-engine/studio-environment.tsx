'use client';

import { useMockupStore } from '@/stores/mockup-store';
import { EnvironmentPreset } from '@/types/mockup';
import { BackgroundModels } from './background-models';

interface StudioEnvironmentProps {
  preset?: EnvironmentPreset;
}

export function StudioEnvironment({ preset }: StudioEnvironmentProps = {}) {
  const { environmentPreset: storePreset } = useMockupStore();
  const env = preset || storePreset;

  const getLighting = (env: EnvironmentPreset) => {
    switch (env) {
      case 'studio_clean':
        return {
          bg: '#FFFFFF',
          ambient: 0.8,
          ambientColor: '#FFFFFF',
          key: 1.6,
          keyColor: '#FFF8F0',
          keyPos: [3, 4, 3] as [number, number, number],
          rim: 0.8,
          rimColor: '#E0E8FF',
        };
      case 'urban_street':
        return {
          bg: '#181A20',
          ambient: 0.5,
          ambientColor: '#9098A8',
          key: 2.2,
          keyColor: '#FFAA66',
          keyPos: [4, 6, 2] as [number, number, number],
          rim: 1.2,
          rimColor: '#5588FF',
        };
      case 'minimal_gray':
        return {
          bg: '#252830',
          ambient: 0.7,
          ambientColor: '#D0D4DC',
          key: 1.4,
          keyColor: '#FFFFFF',
          keyPos: [2, 5, 3] as [number, number, number],
          rim: 0.6,
          rimColor: '#B0B8C8',
        };
      case 'obsidian_dark':
      default:
        return {
          bg: '#0A0B0D',
          ambient: 0.45,
          ambientColor: '#606878',
          key: 1.8,
          keyColor: '#F0F4FF',
          keyPos: [2.5, 4.5, 3.5] as [number, number, number],
          rim: 1.4,
          rimColor: '#E2F952', // Subtle Volt neon rim
        };
    }
  };

  const config = getLighting(env);

  return (
    <>
      {/* Background Color */}
      <color attach="background" args={[config.bg]} />

      {/* Ambient Lighting */}
      <ambientLight intensity={config.ambient} color={config.ambientColor} />

      {/* Key Light with Shadows */}
      <directionalLight
        position={config.keyPos}
        intensity={config.key}
        color={config.keyColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Rim / Back Accent Light */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={config.rim}
        color={config.rimColor}
      />

      {/* 3D Background Models & Sets */}
      <BackgroundModels env={env} />
    </>
  );
}
