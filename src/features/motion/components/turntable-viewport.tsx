'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GarmentMesh } from '@/features/mockups/3d-engine/garment-mesh';
import { StudioEnvironment } from '@/features/mockups/3d-engine/studio-environment';
import { useMotionStore } from '@/stores/motion-store';
import { toast } from 'sonner';

export interface TurntableRef {
  startVideoRecording: () => void;
}

export interface TurntableViewportProps {
  onReady?: (api: TurntableRef) => void;
}

function ContinuousRotatingRig() {
  const { rpm } = useMotionStore();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const radPerSec = (rpm * 2 * Math.PI) / 60;
      groupRef.current.rotation.y += delta * radPerSec;
    }
  });

  return (
    <group ref={groupRef}>
      <GarmentMesh />
    </group>
  );
}

// Inner Controller that captures the WebGL stream from useThree
function TurntableRecorderController({ onReady }: { onReady?: (api: TurntableRef) => void }) {
  const { gl } = useThree();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const {
    durationSeconds,
    isRecording,
    setIsRecording,
    setRecordingProgress,
    setRecordedVideoUrl,
  } = useMotionStore();

  const startRecord = useCallback(() => {
    if (!gl.domElement || isRecording) return;

    const canvas = gl.domElement;
    recordedChunksRef.current = [];

    try {
      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(60) : null;
      if (!stream) {
        toast.error('Canvas capture stream not supported in this browser');
        return;
      }

      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
        setRecordingProgress(0);
        toast.success(`360° Turntable Video Rendered (${durationSeconds}s Loop)`);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);

      const startTime = Date.now();
      const totalMs = durationSeconds * 1000;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setRecordingProgress(pct);

        if (elapsed >= totalMs) {
          clearInterval(progressInterval);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 100);
    } catch (err) {
      console.error('Failed to initialize MediaRecorder:', err);
      setIsRecording(false);
      toast.error('Video recording failed to start');
    }
  }, [gl, isRecording, durationSeconds, setIsRecording, setRecordingProgress, setRecordedVideoUrl]);

  useEffect(() => {
    if (onReady) {
      onReady({ startVideoRecording: startRecord });
    }
    (window as any).__STB_TURNTABLE_START_RECORD__ = startRecord;
  }, [onReady, startRecord]);

  return null;
}

export const TurntableViewport = forwardRef<TurntableRef, TurntableViewportProps>(
  ({ onReady }, ref) => {
    const internalRef = useRef<TurntableRef>({
      startVideoRecording: () => {
        if (typeof window !== 'undefined' && (window as any).__STB_TURNTABLE_START_RECORD__) {
          (window as any).__STB_TURNTABLE_START_RECORD__();
        }
      },
    });

    useImperativeHandle(ref, () => internalRef.current);

    const { aspectRatio } = useMotionStore();

    let containerAspect = 'aspect-[9/16] max-h-[82vh]';
    if (aspectRatio === '1:1') containerAspect = 'aspect-square max-h-[75vh]';
    if (aspectRatio === '16:9') containerAspect = 'aspect-video w-full max-w-4xl';

    const handleReady = useCallback(
      (api: TurntableRef) => {
        internalRef.current = api;
        if (onReady) onReady(api);
      },
      [onReady]
    );

    return (
      <div className="relative flex-1 h-full w-full flex items-center justify-center p-6 bg-[#07080A]">
        <div
          className={`relative ${containerAspect} rounded-sm border-2 border-brand-volt/60 bg-[#0C0D10] shadow-2xl overflow-hidden transition-all duration-300`}
        >
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
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={1.2}
              maxDistance={5.0}
              makeDefault
            />
            <StudioEnvironment />
            <TurntableRecorderController onReady={handleReady} />
            <ContinuousRotatingRig />
          </Canvas>
        </div>
      </div>
    );
  }
);

TurntableViewport.displayName = 'TurntableViewport';
