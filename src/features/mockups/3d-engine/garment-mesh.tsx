'use client';

import { useMemo, useEffect, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF, Decal } from '@react-three/drei';
import { useStudioStore } from '@/stores/studio-store';
import { useMockupStore } from '@/stores/mockup-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { texturePipeline } from '@/features/studio/canvas-2d/texture-pipeline';

// Preload 3D GLB assets in browser cache
if (typeof window !== 'undefined') {
  try {
    useGLTF.preload('/models/shirt.glb');
    useGLTF.preload('/models/pants.glb');
  } catch {}
}

// Micro-weave fabric normal bump texture generator
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
      const weave = ((x % 4 < 2 && y % 4 < 2) || (x % 4 >= 2 && y % 4 >= 2)) ? 28 : -28;
      const noise = (Math.random() - 0.5) * 10;
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

// --------------------------------------------------------------------------
// 1. AUTHENTIC 3D GLTF SHIRT (T-Shirt, Oversized Tee, Jersey, Sweatshirt)
// --------------------------------------------------------------------------
interface ShirtGLTFProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  scale: [number, number, number];
  pbrRoughness: number;
}

function RealShirtModel({ fabricMaterial, frontTex, backTex, scale, pbrRoughness }: ShirtGLTFProps) {
  const { nodes } = useGLTF('/models/shirt.glb') as any;

  const meshGeometry = useMemo(() => {
    if (nodes?.T_Shirt_male?.geometry) {
      const geom = nodes.T_Shirt_male.geometry.clone();
      geom.computeVertexNormals();
      return geom;
    }
    return null;
  }, [nodes]);

  if (!meshGeometry) return null;

  return (
    <group position={[0, 0.1, 0]} scale={scale}>
      <mesh
        castShadow
        receiveShadow
        geometry={meshGeometry}
        material={fabricMaterial}
        dispose={null}
      >
        {/* Front Chest Graphic Decal wrapped seamlessly onto 3D cloth folds */}
        {frontTex && (
          <Decal
            position={[0, 0.04, 0.145]}
            rotation={[0, 0, 0]}
            scale={[0.26, 0.32, 0.28]}
          >
            <meshStandardMaterial
              map={frontTex}
              transparent
              alphaTest={0.005}
              roughness={pbrRoughness}
              polygonOffset
              polygonOffsetFactor={-2}
              depthTest
              depthWrite={false}
            />
          </Decal>
        )}

        {/* Full Back Graphic Decal wrapped onto back cloth folds */}
        {backTex && (
          <Decal
            position={[0, 0.04, -0.14]}
            rotation={[0, Math.PI, 0]}
            scale={[0.26, 0.32, 0.28]}
          >
            <meshStandardMaterial
              map={backTex}
              transparent
              alphaTest={0.005}
              roughness={pbrRoughness}
              polygonOffset
              polygonOffsetFactor={-2}
              depthTest
              depthWrite={false}
            />
          </Decal>
        )}
      </mesh>
    </group>
  );
}

// --------------------------------------------------------------------------
// 2. STREETWEAR HEAVYWEIGHT HOODIE (Long Sleeves, Ribbed Cuffs, Kangaroo Pocket, Hood)
// --------------------------------------------------------------------------
interface HoodieProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  pbrRoughness: number;
}

function RealisticHoodieModel({ fabricMaterial, frontTex, backTex, pbrRoughness }: HoodieProps) {
  return (
    <group position={[0, 0.05, 0]}>
      {/* Heavyweight Boxy Torso */}
      <mesh material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.72, 1.35, 32]} />
      </mesh>

      {/* Ribbed Bottom Waistband */}
      <mesh position={[0, -0.68, 0]} material={fabricMaterial} castShadow>
        <cylinderGeometry args={[0.68, 0.69, 0.14, 32]} />
      </mesh>

      {/* LEFT LONG SLEEVE (Upper Arm + Forearm + Ribbed Wrist Cuff) */}
      <group position={[-0.72, 0.28, 0]} rotation={[0, 0, 0.58]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.35, 0]} material={fabricMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.22, 0.72, 24]} />
        </mesh>
        {/* Forearm angled naturally */}
        <group position={[0, -0.7, 0]} rotation={[0, 0, -0.16]}>
          <mesh position={[0, -0.32, 0]} material={fabricMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.65, 24]} />
          </mesh>
          {/* Thick Ribbed Wrist Cuff */}
          <mesh position={[0, -0.66, 0]} material={fabricMaterial} castShadow>
            <cylinderGeometry args={[0.185, 0.175, 0.15, 24]} />
          </mesh>
        </group>
      </group>

      {/* RIGHT LONG SLEEVE (Upper Arm + Forearm + Ribbed Wrist Cuff) */}
      <group position={[0.72, 0.28, 0]} rotation={[0, 0, -0.58]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.35, 0]} material={fabricMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.22, 0.72, 24]} />
        </mesh>
        {/* Forearm angled naturally */}
        <group position={[0, -0.7, 0]} rotation={[0, 0, 0.16]}>
          <mesh position={[0, -0.32, 0]} material={fabricMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.65, 24]} />
          </mesh>
          {/* Thick Ribbed Wrist Cuff */}
          <mesh position={[0, -0.66, 0]} material={fabricMaterial} castShadow>
            <cylinderGeometry args={[0.185, 0.175, 0.15, 24]} />
          </mesh>
        </group>
      </group>

      {/* 3D DRAPED STREETWEAR HOOD */}
      <group position={[0, 0.72, -0.06]} rotation={[0.2, 0, 0]}>
        <mesh material={fabricMaterial} castShadow>
          <sphereGeometry args={[0.42, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        </mesh>
        {/* Double-Lined Hood Opening Collar Rim */}
        <mesh position={[0, -0.14, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={fabricMaterial}>
          <torusGeometry args={[0.3, 0.065, 16, 32]} />
        </mesh>
      </group>

      {/* 3D KANGAROO POUCH POCKET WITH OPEN HAND SLITS */}
      <group position={[0, -0.32, 0.42]} rotation={[-0.04, 0, 0]}>
        {/* Main Pouch Body */}
        <mesh material={fabricMaterial} castShadow>
          <boxGeometry args={[0.66, 0.34, 0.09]} />
        </mesh>
        {/* Left Slanted Hand Entry */}
        <mesh position={[-0.34, 0, 0]} rotation={[0, 0.42, 0]} material={fabricMaterial}>
          <boxGeometry args={[0.04, 0.3, 0.08]} />
        </mesh>
        {/* Right Slanted Hand Entry */}
        <mesh position={[0.34, 0, 0]} rotation={[0, -0.42, 0]} material={fabricMaterial}>
          <boxGeometry args={[0.04, 0.3, 0.08]} />
        </mesh>
      </group>

      {/* HANGING BRAIDED DRAWCORD WITH METAL AGLETS */}
      <group position={[-0.08, 0.44, 0.42]} rotation={[0, 0, -0.05]}>
        <mesh material={fabricMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
        </mesh>
        {/* Metal Tip */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.045, 12]} />
          <meshStandardMaterial color="#E5E7EB" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      <group position={[0.08, 0.44, 0.42]} rotation={[0, 0, 0.05]}>
        <mesh material={fabricMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
        </mesh>
        {/* Metal Tip */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.045, 12]} />
          <meshStandardMaterial color="#E5E7EB" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* FRONT CHEST GRAPHIC (Positioned above kangaroo pocket) */}
      {frontTex && (
        <mesh position={[0, 0.18, 0.76]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.85, 0.65]} />
          <meshStandardMaterial
            map={frontTex}
            transparent
            alphaTest={0.005}
            polygonOffset
            polygonOffsetFactor={-2}
            side={THREE.FrontSide}
          />
        </mesh>
      )}

      {/* FULL BACK GRAPHIC */}
      {backTex && (
        <mesh position={[0, 0.06, -0.76]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.92, 1.1]} />
          <meshStandardMaterial
            map={backTex}
            transparent
            alphaTest={0.005}
            polygonOffset
            polygonOffsetFactor={-2}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </group>
  );
}

// --------------------------------------------------------------------------
// 3. AUTHENTIC 3D PANTS & SHORTS (GLB Trousers, Cargos, Sweatpants, Denim Jeans)
// --------------------------------------------------------------------------
interface PantsProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  category: string;
}

function RealPantsModel({ fabricMaterial, frontTex, backTex, category }: PantsProps) {
  const { nodes } = useGLTF('/models/pants.glb') as any;

  const isCargos = category === 'WIDE_LEG_CARGO_PANTS';
  const isJeans = category === 'RELAXED_DENIM_JEANS';
  const isSweatpants = category === 'HEAVYWEIGHT_SWEATPANTS';
  const isShorts = category === 'FLEECE_SHORTS';

  const pantsMesh = useMemo(() => {
    const meshNode = nodes?.M_lBody_OxfordPants || nodes?.['Mesh.054'];
    if (meshNode?.geometry) {
      const geom = meshNode.geometry.clone();
      geom.computeVertexNormals();
      return geom;
    }
    return null;
  }, [nodes]);

  // Scale based on streetwear silhouette
  let scaleFactor: [number, number, number] = [2.35, 2.2, 2.35];
  if (isCargos) scaleFactor = [2.5, 2.2, 2.5]; // Wide tactical leg
  if (isJeans) scaleFactor = [2.38, 2.2, 2.38]; // 14oz relaxed straight
  if (isSweatpants) scaleFactor = [2.4, 2.2, 2.4]; // Fleece jogger
  if (isShorts) scaleFactor = [2.4, 1.25, 2.4]; // Shorts crop

  return (
    <group position={[0, isShorts ? 0.35 : -0.9, 0]}>
      {/* 3D GLB Pants Base Mesh */}
      {pantsMesh && (
        <group scale={scaleFactor}>
          <mesh
            castShadow
            receiveShadow
            geometry={pantsMesh}
            material={fabricMaterial}
            dispose={null}
          >
            {/* Front Thigh Graphic Decal */}
            {frontTex && (
              <Decal
                position={[-0.09, 0.55, 0.13]}
                rotation={[0, 0, 0]}
                scale={[0.13, 0.18, 0.13]}
              >
                <meshStandardMaterial
                  map={frontTex}
                  transparent
                  alphaTest={0.005}
                  polygonOffset
                  polygonOffsetFactor={-2}
                  depthTest
                  depthWrite={false}
                />
              </Decal>
            )}

            {/* Back Pocket / Hip Decal */}
            {backTex && (
              <Decal
                position={[0.08, 0.72, -0.13]}
                rotation={[0, Math.PI, 0]}
                scale={[0.13, 0.13, 0.13]}
              >
                <meshStandardMaterial
                  map={backTex}
                  transparent
                  alphaTest={0.005}
                  polygonOffset
                  polygonOffsetFactor={-2}
                  depthTest
                  depthWrite={false}
                />
              </Decal>
            )}
          </mesh>
        </group>
      )}

      {/* 3D CARGO BELLOW UTILITY POCKETS (Cargo Pants) */}
      {isCargos && (
        <>
          {/* Left Thigh Cargo Pocket */}
          <group position={[-0.6, 0.32, 0]}>
            <mesh material={fabricMaterial} castShadow>
              <boxGeometry args={[0.12, 0.42, 0.3]} />
            </mesh>
            {/* Pocket Flap */}
            <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0.12]} material={fabricMaterial}>
              <boxGeometry args={[0.14, 0.08, 0.32]} />
            </mesh>
          </group>

          {/* Right Thigh Cargo Pocket */}
          <group position={[0.6, 0.32, 0]}>
            <mesh material={fabricMaterial} castShadow>
              <boxGeometry args={[0.12, 0.42, 0.3]} />
            </mesh>
            {/* Pocket Flap */}
            <mesh position={[0, 0.22, 0]} rotation={[0, 0, -0.12]} material={fabricMaterial}>
              <boxGeometry args={[0.14, 0.08, 0.32]} />
            </mesh>
          </group>
        </>
      )}

      {/* 3D DENIM BACK PATCH POCKETS (Denim Jeans) */}
      {isJeans && (
        <>
          <mesh position={[-0.22, 0.68, -0.38]} rotation={[0, Math.PI, 0]} material={fabricMaterial}>
            <boxGeometry args={[0.26, 0.26, 0.02]} />
          </mesh>
          <mesh position={[0.22, 0.68, -0.38]} rotation={[0, Math.PI, 0]} material={fabricMaterial}>
            <boxGeometry args={[0.26, 0.26, 0.02]} />
          </mesh>
        </>
      )}

      {/* HANGING DRAWSTRINGS (Sweatpants & Shorts) */}
      {(isSweatpants || isShorts) && (
        <group position={[0, 1.25, 0.38]}>
          <mesh position={[-0.04, -0.14, 0]} material={fabricMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 12]} />
          </mesh>
          <mesh position={[0.04, -0.14, 0]} material={fabricMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 12]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// --------------------------------------------------------------------------
// 4. ATHLETIC CREW SOCKS
// --------------------------------------------------------------------------
interface SocksProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
}

function RealisticSocksModel({ fabricMaterial, frontTex }: SocksProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 2x1 Athletic Ribbed Leg Tube */}
      <mesh material={fabricMaterial} castShadow>
        <cylinderGeometry args={[0.18, 0.16, 0.95, 24]} />
      </mesh>

      {/* Cushioned Footbed Tube */}
      <mesh position={[0, -0.42, 0.26]} rotation={[Math.PI / 2, 0, 0]} material={fabricMaterial} castShadow>
        <cylinderGeometry args={[0.16, 0.15, 0.75, 24]} />
      </mesh>

      {/* Seamless Toe Cap */}
      <mesh position={[0, -0.42, 0.63]} material={fabricMaterial}>
        <sphereGeometry args={[0.15, 16, 16]} />
      </mesh>

      {/* Contoured Heel Cup */}
      <mesh position={[0, -0.42, -0.1]} material={fabricMaterial}>
        <sphereGeometry args={[0.16, 16, 16]} />
      </mesh>

      {/* Ankle Graphic Decal */}
      {frontTex && (
        <mesh position={[0, 0.12, 0.2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.26, 0.34]} />
          <meshStandardMaterial
            map={frontTex}
            transparent
            alphaTest={0.005}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      )}
    </group>
  );
}

// --------------------------------------------------------------------------
// MAIN GARMENT COMPONENT EXPORT
// --------------------------------------------------------------------------
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

  // Fabric micro-weave bump normal map
  const fabricNormal = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createFabricNormalMap();
  }, []);

  // Synchronize 2D studio canvas textures
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
        setFrontTex((prev) => {
          if (prev) prev.dispose();
          const ft = new THREE.CanvasTexture(frontCanvas);
          ft.anisotropy = 16;
          ft.generateMipmaps = true;
          ft.minFilter = THREE.LinearMipmapLinearFilter;
          ft.needsUpdate = true;
          return ft;
        });
      }

      // 2. Render back surface
      const backCanvas = await texturePipeline.renderSurface(
        'BACK',
        project.layers.BACK || []
      );
      if (isMounted) {
        setBackTex((prev) => {
          if (prev) prev.dispose();
          const bt = new THREE.CanvasTexture(backCanvas);
          bt.anisotropy = 16;
          bt.generateMipmaps = true;
          bt.minFilter = THREE.LinearMipmapLinearFilter;
          bt.needsUpdate = true;
          return bt;
        });
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

  // Determine silhouette model type
  const isHoodie = activeGarment.geometryType === 'hoodie';
  const isPants =
    activeGarment.geometryType === 'cargos' ||
    activeGarment.geometryType === 'sweatpants' ||
    activeGarment.geometryType === 'jeans' ||
    activeGarment.geometryType === 'shorts';
  const isSocks = activeGarment.geometryType === 'socks';

  // Scale preset for shirts
  let shirtScale: [number, number, number] = [2.6, 2.5, 2.6];
  if (activeGarment.category === 'OVERSIZED_TEE') {
    shirtScale = [2.75, 2.5, 2.75]; // Streetwear drop-shoulder boxy cut
  } else if (activeGarment.category === 'REGULAR_TEE') {
    shirtScale = [2.45, 2.45, 2.45]; // Classic tailored fit
  } else if (activeGarment.category === 'BASKETBALL_JERSEY') {
    shirtScale = [2.35, 2.5, 2.35]; // Athletic cut
  } else if (activeGarment.category === 'CREWNECK_SWEATSHIRT') {
    shirtScale = [2.7, 2.55, 2.7]; // Heavy boxy cut
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. REAL 3D T-SHIRT / JERSEY / SWEATSHIRT */}
      {!isHoodie && !isPants && !isSocks && (
        <Suspense fallback={null}>
          <RealShirtModel
            fabricMaterial={fabricMaterial}
            frontTex={frontTex}
            backTex={backTex}
            scale={shirtScale}
            pbrRoughness={pbr.roughness}
          />
        </Suspense>
      )}

      {/* 2. REALISTIC 3D HEAVYWEIGHT HOODIE */}
      {isHoodie && (
        <RealisticHoodieModel
          fabricMaterial={fabricMaterial}
          frontTex={frontTex}
          backTex={backTex}
          pbrRoughness={pbr.roughness}
        />
      )}

      {/* 3. AUTHENTIC 3D PANTS / SHORTS */}
      {isPants && (
        <Suspense fallback={null}>
          <RealPantsModel
            fabricMaterial={fabricMaterial}
            frontTex={frontTex}
            backTex={backTex}
            category={activeGarment.category}
          />
        </Suspense>
      )}

      {/* 4. ATHLETIC CREW SOCKS */}
      {isSocks && (
        <RealisticSocksModel
          fabricMaterial={fabricMaterial}
          frontTex={frontTex}
        />
      )}
    </group>
  );
}
