'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStudioStore } from '@/stores/studio-store';
import { useMockupStore } from '@/stores/mockup-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { texturePipeline } from '@/features/studio/canvas-2d/texture-pipeline';

// Helper to generate an authentic micro-weave fabric normal bump texture
function createFabricNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

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
  const [frontTex, setFrontTex] = useState<THREE.CanvasTexture | null>(null);
  const [backTex, setBackTex] = useState<THREE.CanvasTexture | null>(null);

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

    let isMounted = true;

    const syncTextures = async () => {
      // 1. Render front surface
      const frontCanvas = await texturePipeline.renderSurface(
        'FRONT',
        project.layers.FRONT || []
      );
      if (isMounted) {
        const ft = new THREE.CanvasTexture(frontCanvas);
        ft.anisotropy = 16;
        ft.generateMipmaps = true;
        ft.minFilter = THREE.LinearMipmapLinearFilter;
        ft.needsUpdate = true;
        setFrontTex(ft);
      }

      // 2. Render back surface
      const backCanvas = await texturePipeline.renderSurface(
        'BACK',
        project.layers.BACK || []
      );
      if (isMounted) {
        const bt = new THREE.CanvasTexture(backCanvas);
        bt.anisotropy = 16;
        bt.generateMipmaps = true;
        bt.minFilter = THREE.LinearMipmapLinearFilter;
        bt.needsUpdate = true;
        setBackTex(bt);
      }
    };

    syncTextures();

    return () => {
      isMounted = false;
    };
  }, [project.layers, textureVersion]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      frontTex?.dispose();
      backTex?.dispose();
      fabricNormal?.dispose();
    };
  }, [frontTex, backTex, fabricNormal]);

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
        body = new THREE.CylinderGeometry(0.72, 0.74, 1.45, 32, 1, false);
        leftArm = new THREE.CylinderGeometry(0.24, 0.18, 1.1, 16);
        rightArm = new THREE.CylinderGeometry(0.24, 0.18, 1.1, 16);
        extra = new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.75);
        collar = new THREE.BoxGeometry(0.68, 0.32, 0.12);
      } else if (gType === 'sweatshirt') {
        body = new THREE.CylinderGeometry(0.68, 0.7, 1.4, 32);
        leftArm = new THREE.CylinderGeometry(0.22, 0.16, 1.05, 16);
        rightArm = new THREE.CylinderGeometry(0.22, 0.16, 1.05, 16);
        collar = new THREE.TorusGeometry(0.26, 0.05, 12, 24);
      } else if (gType === 'jersey') {
        body = new THREE.CylinderGeometry(0.62, 0.64, 1.45, 32);
        collar = new THREE.TorusGeometry(0.28, 0.04, 12, 24);
      } else if (gType === 'shorts') {
        body = new THREE.CylinderGeometry(0.62, 0.65, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.3, 0.32, 0.65, 24);
        rightArm = new THREE.CylinderGeometry(0.3, 0.32, 0.65, 24);
      } else if (gType === 'cargos') {
        body = new THREE.CylinderGeometry(0.58, 0.6, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.29, 0.34, 1.55, 24);
        rightArm = new THREE.CylinderGeometry(0.29, 0.34, 1.55, 24);
        extra = new THREE.BoxGeometry(0.12, 0.34, 0.28);
        collar = new THREE.BoxGeometry(0.12, 0.34, 0.28);
      } else if (gType === 'sweatpants') {
        body = new THREE.CylinderGeometry(0.56, 0.58, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.27, 0.19, 1.55, 24);
        rightArm = new THREE.CylinderGeometry(0.27, 0.19, 1.55, 24);
      } else if (gType === 'jeans') {
        body = new THREE.CylinderGeometry(0.56, 0.58, 0.35, 32);
        leftArm = new THREE.CylinderGeometry(0.26, 0.25, 1.55, 24);
        rightArm = new THREE.CylinderGeometry(0.26, 0.25, 1.55, 24);
      } else if (gType === 'socks') {
        body = new THREE.CylinderGeometry(0.18, 0.17, 0.9, 20);
        extra = new THREE.CylinderGeometry(0.16, 0.15, 0.7, 20);
      } else {
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

  // Decal Quad Materials with polygonOffset to prevent any clipping/z-fighting
  const frontDecalMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: frontTex,
      transparent: true,
      opacity: 0.99,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      side: THREE.FrontSide,
    });
  }, [frontTex]);

  const backDecalMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: backTex,
      transparent: true,
      opacity: 0.99,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      side: THREE.FrontSide,
    });
  }, [backTex]);

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

          {/* Left Thigh Graphic Decal (offset slightly forward at z = 0.38) */}
          <mesh position={[-0.28, -0.25, 0.38]} rotation={[0, 0, 0]} material={frontDecalMaterial}>
            <planeGeometry args={[0.5, 0.65]} />
          </mesh>

          {/* Hip Back Graphic Decal */}
          <mesh position={[0, 0.05, -0.63]} rotation={[0, Math.PI, 0]} material={backDecalMaterial}>
            <planeGeometry args={[0.6, 0.5]} />
          </mesh>
        </group>
      )}

      {/* 2. SOCKS */}
      {isSocks && (
        <group position={[0, 0, 0]}>
          <mesh geometry={bodyGeometry} material={fabricMaterial} castShadow />
          {pocketOrHoodGeometry && (
            <mesh
              geometry={pocketOrHoodGeometry}
              material={fabricMaterial}
              position={[0, -0.4, 0.25]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            />
          )}
          {/* Sock Graphic */}
          <mesh position={[0, 0.1, 0.22]} material={frontDecalMaterial}>
            <planeGeometry args={[0.3, 0.4]} />
          </mesh>
        </group>
      )}

      {/* 3. UPPER BODY: TEES, HOODIES, SWEATSHIRTS, JERSEYS */}
      {!isLowerBody && !isSocks && (
        <group position={[0, 0, 0]}>
          {/* Main Torso */}
          <mesh geometry={bodyGeometry} material={fabricMaterial} castShadow receiveShadow />

          {/* Left Sleeve */}
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

          {/* Right Sleeve */}
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
              {pocketOrHoodGeometry && (
                <mesh
                  geometry={pocketOrHoodGeometry}
                  material={fabricMaterial}
                  position={[0, 0.82, -0.1]}
                  rotation={[0.2, 0, 0]}
                  castShadow
                />
              )}
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

          {/* FRONT GRAPHIC DECAL PLANE:
              Positioned at z = 0.78 for hoodies or z = 0.76 for tees so it NEVER clips inside body */}
          <mesh
            position={[
              0,
              activeGarment.geometryType === 'hoodie' ? 0.15 : 0.05,
              activeGarment.geometryType === 'hoodie' ? 0.78 : 0.76,
            ]}
            rotation={[0, 0, 0]}
            material={frontDecalMaterial}
          >
            <planeGeometry args={[0.95, 1.18]} />
          </mesh>

          {/* BACK GRAPHIC DECAL PLANE:
              Positioned at z = -0.78 for hoodies or z = -0.76 for tees */}
          <mesh
            position={[0, 0.05, activeGarment.geometryType === 'hoodie' ? -0.78 : -0.76]}
            rotation={[0, Math.PI, 0]}
            material={backDecalMaterial}
          >
            <planeGeometry args={[0.95, 1.18]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
