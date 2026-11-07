'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GarmentMesh } from '../3d-engine/garment-mesh';
import { StudioEnvironment } from '../3d-engine/studio-environment';
import { useMockupStore } from '@/stores/mockup-store';
import { CameraPreset } from '@/types/mockup';

export interface ViewportRef {
  captureSnapshot: () => string;
}

export interface MockupViewportProps {
  onReady?: (api: ViewportRef) => void;
}

// Inner Controller that has access to live R3F Three.js context
function SceneCameraController({ onReady }: { onReady?: (api: ViewportRef) => void }) {
  const { gl, scene, camera } = useThree();
  const { cameraPreset, autoRotate } = useMockupStore();
  const controlsRef = useRef<any>(null);

  // Expose bulletproof snapshot API
  const getSnapshot = useCallback(() => {
    // Explicitly render scene to guarantee buffer is fully painted
    gl.render(scene, camera);
    return gl.domElement.toDataURL('image/png', 1.0);
  }, [gl, scene, camera]);

  useEffect(() => {
    if (onReady) {
      onReady({ captureSnapshot: getSnapshot });
    }
    // Also attach to window as fallback
    (window as any).__STB_MOCKUP_CAPTURE__ = getSnapshot;
  }, [onReady, getSnapshot]);

  // Handle cinematic camera snaps
  useEffect(() => {
    if (!controlsRef.current) return;

    const cam = controlsRef.current.object as THREE.PerspectiveCamera;
    const target = controlsRef.current.target as THREE.Vector3;

    switch (cameraPreset) {
      case 'isometric':
        cam.position.set(2.4, 1.2, 2.4);
        target.set(0, 0, 0);
        break;
      case 'graphic':
        cam.position.set(0, 0.1, 1.55);
        target.set(0, 0.1, 0);
        break;
      case 'back':
        cam.position.set(0, 0, -3.2);
        target.set(0, 0, 0);
        break;
      case 'macro':
        cam.position.set(0.3, 0.25, 0.95);
        target.set(0, 0.1, 0);
        break;
      case 'hero':
      default:
        cam.position.set(0, 0, 3.2);
        target.set(0, 0, 0);
        break;
    }

    cam.updateProjectionMatrix();
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

export const MockupViewport = forwardRef<ViewportRef, MockupViewportProps>(
  ({ onReady }, ref) => {
    const internalRef = useRef<ViewportRef>({
      captureSnapshot: () => {
        if (typeof window !== 'undefined' && (window as any).__STB_MOCKUP_CAPTURE__) {
          return (window as any).__STB_MOCKUP_CAPTURE__();
        }
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        return canvas ? canvas.toDataURL('image/png', 1.0) : '';
      },
    });

    useImperativeHandle(ref, () => internalRef.current);

    const handleSceneReady = useCallback(
      (api: ViewportRef) => {
        internalRef.current = api;
        if (onReady) onReady(api);
      },
      [onReady]
    );

    return (
      <div className="relative h-full w-full bg-[#0A0B0D] overflow-hidden select-none">
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 3.2], fov: 42 }}
          className="h-full w-full"
        >
          <SceneCameraController onReady={handleSceneReady} />
          <StudioEnvironment />
          <Suspense fallback={null}>
            <GarmentMesh />
          </Suspense>
        </Canvas>
      </div>
    );
  }
);

MockupViewport.displayName = 'MockupViewport';
