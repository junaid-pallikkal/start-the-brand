'use client';

import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GarmentMesh } from '@/features/mockups/3d-engine/garment-mesh';
import { StudioEnvironment } from '@/features/mockups/3d-engine/studio-environment';
import { useMotionStore } from '@/stores/motion-store';
import { toast } from 'sonner';

export interface TurntableRef {
  startVideoRecording: () => void;
}

function ContinuousRotatingRig() {
  const { rpm } = useMotionStore();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rotation speed radians per second: rpm * 2 * PI / 60
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

export const TurntableViewport = forwardRef<TurntableRef>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const {
    durationSeconds,
    aspectRatio,
    isRecording,
    setIsRecording,
    setRecordingProgress,
    setRecordedVideoUrl,
  } = useMotionStore();

  useImperativeHandle(ref, () => ({
    startVideoRecording: () => {
      if (!canvasRef.current || isRecording) return;

      const canvas = canvasRef.current;
      recordedChunksRef.current = [];

      try {
        // Capture 60 FPS video stream from WebGL canvas
        const stream = (canvas as any).captureStream(60);

        // Detect supported mimeType
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }

        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 8000000, // 8 Mbps high quality
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

        // Track progress interval
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
        toast.error('Browser video recording not supported in this context');
      }
    },
  }));

  // Aspect ratio styling
  let containerAspect = 'aspect-[9/16] max-h-[82vh]';
  if (aspectRatio === '1:1') containerAspect = 'aspect-square max-h-[75vh]';
  if (aspectRatio === '16:9') containerAspect = 'aspect-video w-full max-w-4xl';

  return (
    <div className="relative flex-1 h-full w-full flex items-center justify-center p-6 bg-[#07080A]">
      <div
        className={`relative ${containerAspect} rounded-sm border-2 border-brand-volt/60 bg-[#0C0D10] shadow-2xl overflow-hidden transition-all duration-300`}
      >
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
          camera={{ position: [0, 0, 3.2], fov: 42 }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
          }}
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
          <ContinuousRotatingRig />
        </Canvas>
      </div>
    </div>
  );
});

TurntableViewport.displayName = 'TurntableViewport';
