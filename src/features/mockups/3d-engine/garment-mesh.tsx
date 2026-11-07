'use client';

import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStudioStore } from '@/stores/studio-store';
import { useMockupStore } from '@/stores/mockup-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { texturePipeline } from '@/features/studio/canvas-2d/texture-pipeline';

// Helper to generate a realistic procedural woven fabric normal bump texture
function createFabricNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Micro-weave cross-hatch pattern
  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = (y * 256 + x) * 4;
      const weave = ((x % 4 < 2 && y % 4 < 2) || (x % 4 >= 2 && y % 4 >= 2)) ? 25 : -25;
      const noise = (Math.random() - 0.5) * 12;
      const val = Math.max(0, Math.min(255, 128 + weave + noise));

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

export function GarmentMesh() {
  const { project, textureVersion } = useStudioStore();
  const { garmentId, garmentColor, pbr, wireframe } = useMockupStore();

  const groupRef = useRef<THREE.Group>(null);
  const frontTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const backTextureRef = useRef<THREE.CanvasTexture | null>(null);

  const activeGarment =
    DEFAULT_GARMENTS.find((g) => g.id === (garmentId || project.garmentId)) ||
    DEFAULT_GARMENTS[0];

  const colorHex = garmentColor || project.garmentColor || '#0B0B0D';

  // Fabric normal map
  const fabricNormal = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createFabricNormalMap();
  }, []);

  // Initialize and update dynamic CanvasTextures from 2D Studio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateTextures = async () => {
      const frontCanvas = await texturePipeline.renderSurface(
        'FRONT',
        project.layers.FRONT || []
      );
      if (!frontTextureRef.current) {
        frontTextureRef.current = new THREE.CanvasTexture(frontCanvas);
      } else {
        frontTextureRef.current.image = frontCanvas;
        frontTextureRef.current.needsUpdate = true;
      }

      const backCanvas = await texturePipeline.renderSurface(
        'BACK',
        project.layers.BACK || []
      );
      if (!backTextureRef.current) {
        backTextureRef.current = new THREE.CanvasTexture(backCanvas);
      } else {
        backTextureRef.current.image = backCanvas;
        backTextureRef.current.needsUpdate = true;
      }
    };

    updateTextures();
  }, [project.layers, textureVersion]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      frontTextureRef.current?.dispose();
      backTextureRef.current?.dispose();
      fabricNormal?.dispose();
    };
  }, [fabricNormal]);

  // Procedural 3D Garment Geometries
  const { bodyGeometry, leftArmGeometry, rightArmGeometry, pocketOrHoodGeometry, collarGeometry } =
    useMemo(() => {
      const gType = activeGarment.geometryType;

      let body: THREE.BufferGeometry;
      let leftArm: THREE.BufferGeometry | null = null;
      let rightArm: THREE.BufferGeometry | null = null;
      let extra: THREE.BufferGeometry | null = null;
      let collar: THREE.BufferGeometry | null = null;

      if (gType === 'hoodie') {
        // Heavyweight Hoodie: Boxy Torso + Deep Hood + Kangaroo Pocket + Ribbed Cuffs
        body = new THREE.CylinderGeometry(0.72, 0.74, 1.45, 32, 1, false);
        leftArm = new THREE.CylinderGeometry(0.24, 0.18, 1.1, 16);
        rightArm = new THREE.CylinderGeometry(0.24, 0.18, 1.1, 16);
        // Deep Hood (Hemisphere/Sphere)
        extra = new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.75);
        // Kangaroo Pocket
        collar = new THREE.BoxGeometry(0.68, 0.32, 0.12);
      } else if (gType === 'sweatshirt') {
        // Crewneck Sweatshirt: Boxy Torso + Relaxed Sleeves + Ribbed Collar
        body = new THREE.CylinderGeometry(0.68, 0.7, 1.4, 32);
        leftArm = new THREE.CylinderGeometry(0.22, 0.16, 1.05, 16);
        rightArm = new THREE.CylinderGeometry(0.22, 0.16, 1.05, 16);
        collar = new THREE.TorusGeometry(0.26, 0.05, 12, 24);
      } else if (gType === 'jersey') {
        // Retro Basketball Jersey: Athletic Torso + Ribbed Trim + Armhole Cutouts
        body = new THREE.CylinderGeometry(0.62, 0.64, 1.45, 32);
        collar = new THREE.TorusGeometry(0.28, 0.04, 12, 24);
      } else if (gType === 'shorts') {
        // Streetwear Fleece Shorts: Waistband + Left & Right Legs
        body = new THREE.CylinderGeometry(0.62, 0.65, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.3, 0.32, 0.65, 24);
        rightArm = new THREE.CylinderGeometry(0.3, 0.32, 0.65, 24);
      } else if (gType === 'cargos') {
        // Tactical Cargo Pants: Waistband + Twin Wide Legs + Flap Utility Pockets
        body = new THREE.CylinderGeometry(0.58, 0.6, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.29, 0.34, 1.55, 24);
        rightArm = new THREE.CylinderGeometry(0.29, 0.34, 1.55, 24);
        // Cargo flap pocket
        extra = new THREE.BoxGeometry(0.12, 0.34, 0.28);
        collar = new THREE.BoxGeometry(0.12, 0.34, 0.28);
      } else if (gType === 'sweatpants') {
        // Heavy Fleece Sweatpants: Tapered gathered leg cuffs
        body = new THREE.CylinderGeometry(0.56, 0.58, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.27, 0.19, 1.55, 24);
        rightArm = new THREE.CylinderGeometry(0.27, 0.19, 1.55, 24);
      } else if (gType === 'jeans') {
        // 14oz Washed Denim Jeans: Straight Leg Fit
        body = new THREE.CylinderGeometry(0.56, 0.58, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.26, 0.25, 1.55, 24);
        rightArm = new THREE.CylinderGeometry(0.26, 0.25, 1.55, 24);
      } else if (gType === 'socks') {
        // Ribbed Crew Socks: Ankle column + Footbed
        body = new THREE.CylinderGeometry(0.18, 0.17, 0.9, 20);
        extra = new THREE.CylinderGeometry(0.16, 0.15, 0.7, 20);
      } else {
        // Default T-Shirt (Oversized Boxy or Regular Tee)
        const isOversized = activeGarment.category === 'OVERSIZED_TEE';
        body = new THREE.CylinderGeometry(
          isOversized ? 0.72 : 0.64,
          isOversized ? 0.74 : 0.65,
          1.4,
          32
        );
        leftArm = new THREE.CylinderGeometry(
          isOversized ? 0.25 : 0.2,
          isOversized ? 0.23 : 0.18,
          0.6,
          16
        );
        rightArm = new THREE.CylinderGeometry(
          isOversized ? 0.25 : 0.2,
          isOversized ? 0.23 : 0.18,
          0.6,
          16
        );
        collar = new THREE.TorusGeometry(0.26, 0.04, 12, 24);
      }

      return {
        bodyGeometry: body,
        leftArmGeometry: leftArm,
        rightArmGeometry: rightArm,
        pocketOrHoodGeometry: extra,
        collarGeometry: collar,
      };
    }, [activeGarment]);

  // Main PBR Fabric Material
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: pbr.roughness,
      metalness: pbr.metalness,
      normalMap: fabricNormal,
      normalScale: new THREE.Vector2(pbr.normalScale * 0.4, pbr.normalScale * 0.4),
      wireframe,
      side: THREE.DoubleSide,
    });
  }, [colorHex, pbr, fabricNormal, wireframe]);

  // Decal Quad Materials for Front and Back graphics
  const frontDecalMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: frontTextureRef.current,
      transparent: true,
      opacity: 0.98,
      depthWrite: false,
      side: THREE.FrontSide,
    });
  }, [textureVersion]);

  const backDecalMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: backTextureRef.current,
      transparent: true,
      opacity: 0.98,
      depthWrite: false,
      side: THREE.FrontSide,
    });
  }, [textureVersion]);

  const isLowerBody =
    activeGarment.geometryType === 'shorts' ||
    activeGarment.geometryType === 'cargos' ||
    activeGarment.geometryType === 'sweatpants' ||
    activeGarment.geometryType === 'jeans';

  const isSocks = activeGarment.geometryType === 'socks';

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. LOWER BODY: PANTS / SHORTS */}
      {isLowerBody && (
        <group position={[0, 0.4, 0]}>
          {/* Waistband */}
          <mesh geometry={bodyGeometry} material={fabricMaterial} castShadow receiveShadow />

          {/* Left Leg */}
          {leftArmGeometry && (
            <mesh
              geometry={leftArmGeometry}
              material={fabricMaterial}
              position={[-0.28, -0.75, 0]}
              castShadow
              receiveShadow
            />
          )}

          {/* Right Leg */}
          {rightArmGeometry && (
            <mesh
              geometry={rightArmGeometry}
              material={fabricMaterial}
              position={[0.28, -0.75, 0]}
              castShadow
              receiveShadow
            />
          )}

          {/* Cargo Pockets */}
          {activeGarment.geometryType === 'cargos' && pocketOrHoodGeometry && (
            <>
              <mesh
                geometry={pocketOrHoodGeometry}
                material={fabricMaterial}
                position={[-0.58, -0.65, 0]}
                castShadow
              />
              <mesh
                geometry={pocketOrHoodGeometry}
                material={fabricMaterial}
                position={[0.58, -0.65, 0]}
                castShadow
              />
            </>
          )}

          {/* Front Graphic Decal on Thigh */}
          <mesh position={[0, -0.2, 0.48]} rotation={[0, 0, 0]} material={frontDecalMaterial}>
            <planeGeometry args={[0.7, 0.8]} />
          </mesh>
        </group>
      )}

      {/* 2. SOCKS */}
      {isSocks && (
        <group position={[0, 0, 0]}>
          {/* Ankle column */}
          <mesh geometry={bodyGeometry} material={fabricMaterial} castShadow />
          {/* Footbed */}
          {pocketOrHoodGeometry && (
            <mesh
              geometry={pocketOrHoodGeometry}
              material={fabricMaterial}
              position={[0, -0.4, 0.25]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            />
          )}
          {/* Front graphic */}
          <mesh position={[0, 0.1, 0.2]} material={frontDecalMaterial}>
            <planeGeometry args={[0.3, 0.4]} />
          </mesh>
        </group>
      )}

      {/* 3. UPPER BODY: TEES, HOODIES, SWEATSHIRTS, JERSEYS */}
      {!isLowerBody && !isSocks && (
        <group position={[0, 0, 0]}>
          {/* Main Torso */}
          <mesh geometry={bodyGeometry} material={fabricMaterial} castShadow receiveShadow />

          {/* Left Sleeve / Arm */}
          {leftArmGeometry && (
            <mesh
              geometry={leftArmGeometry}
              material={fabricMaterial}
              position={[-0.82, 0.35, 0]}
              rotation={[0, 0, 0.45]}
              castShadow
              receiveShadow
            />
          )}

          {/* Right Sleeve / Arm */}
          {rightArmGeometry && (
            <mesh
              geometry={rightArmGeometry}
              material={fabricMaterial}
              position={[0.82, 0.35, 0]}
              rotation={[0, 0, -0.45]}
              castShadow
              receiveShadow
            />
          )}

          {/* Ribbed Collar */}
          {collarGeometry && activeGarment.geometryType !== 'hoodie' && (
            <mesh
              geometry={collarGeometry}
              material={fabricMaterial}
              position={[0, 0.72, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            />
          )}

          {/* Hoodie Deep Hood & Kangaroo Pocket */}
          {activeGarment.geometryType === 'hoodie' && (
            <>
              {/* Hood */}
              {pocketOrHoodGeometry && (
                <mesh
                  geometry={pocketOrHoodGeometry}
                  material={fabricMaterial}
                  position={[0, 0.82, -0.1]}
                  rotation={[0.2, 0, 0]}
                  castShadow
                />
              )}
              {/* Kangaroo Pocket */}
              {collarGeometry && (
                <mesh
                  geometry={collarGeometry}
                  material={fabricMaterial}
                  position={[0, -0.35, 0.68]}
                  castShadow
                />
              )}
            </>
          )}

          {/* FRONT GRAPHIC DECAL PLANE */}
          <mesh
            position={[0, 0.05, 0.72]}
            rotation={[0, 0, 0]}
            material={frontDecalMaterial}
          >
            <planeGeometry args={[0.92, 1.15]} />
          </mesh>

          {/* BACK GRAPHIC DECAL PLANE */}
          <mesh
            position={[0, 0.05, -0.72]}
            rotation={[0, Math.PI, 0]}
            material={backDecalMaterial}
          >
            <planeGeometry args={[0.92, 1.15]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
