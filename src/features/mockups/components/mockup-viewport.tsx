'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GarmentMesh } from '../3d-engine/garment-mesh';
import { StudioEnvironment } from '../3d-engine/studio-environment';
import { useMockupStore } from '@/stores/mockup-store';
import { CameraPreset } from '@/types/mockup';

export interface ViewportRef {
  captureSnapshot: () => string;
}

function CameraController() {
  const { cameraPreset, autoRotate } = useMockupStore();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    const camera = controlsRef.current.object as THREE.PerspectiveCamera;
    const target = controlsRef.current.target as THREE.Vector3;

    switch (cameraPreset) {
      case 'isometric':
        camera.position.set(2.4, 1.2, 2.4);
        target.set(0, 0, 0);
        break;
      case 'graphic':
        camera.position.set(0, 0.1, 1.6);
        target.set(0, 0.1, 0);
        break;
      case 'back':
        camera.position.set(0, 0, -3.2);
        target.set(0, 0, 0);
        break;
      case 'macro':
        camera.position.set(0.3, 0.25, 0.95);
        target.set(0, 0.1, 0);
        break;
      case 'hero':
      default:
        camera.position.set(0, 0, 3.2);
        target.set(0, 0, 0);
        break;
    }

    camera.updateProjectionMatrix();
    controlsRef.current.update();
  }, [cameraPreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={0.8}
      maxDistance={6.0}
      autoRotate={autoRotate}
      autoRotateSpeed={2.5}
      makeDefault
    />
  );
}

export const MockupViewport = forwardRef<ViewportRef>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!canvasRef.current) return '';
      return canvasRef.current.toDataURL('image/png', 1.0);
    },
  }));

  return (
    <div className="relative h-full w-full bg-[#0A0B0D] overflow-hidden select-none">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        onCreated={({ gl }) => {
          canvasRef.current = gl.domElement;
        }}
        className="h-full w-full"
      >
        <CameraController />
        <StudioEnvironment />
        <GarmentMesh />
      </Canvas>
    </div>
  );
});

MockupViewport.displayName = 'MockupViewport';
