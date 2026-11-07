'use client';

import { useMemo, useEffect, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF, Decal } from '@react-three/drei';
import { useStudioStore } from '@/stores/studio-store';
import { useMockupStore } from '@/stores/mockup-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { texturePipeline } from '@/features/studio/canvas-2d/texture-pipeline';

// Preload the real 3D shirt GLB asset immediately into cache
if (typeof window !== 'undefined') {
  try {
    useGLTF.preload('/models/shirt.glb');
  } catch {}
}

// Authentic micro-weave fabric normal bump texture generator
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
// 2. STREETWEAR HEAVYWEIGHT HOODIE (Draped Hood, Kangaroo Pocket, Drawstrings)
// --------------------------------------------------------------------------
interface HoodieProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  pbrRoughness: number;
}

function RealisticHoodieModel({ fabricMaterial, frontTex, backTex, pbrRoughness }: HoodieProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* Real 3D Shirt Body & Sleeves as base */}
      <Suspense fallback={null}>
        <RealShirtModel
          fabricMaterial={fabricMaterial}
          frontTex={frontTex}
          backTex={backTex}
          scale={[2.75, 2.55, 2.75]}
          pbrRoughness={pbrRoughness}
        />
      </Suspense>

      {/* Draped Heavyweight 3D Streetwear Hood */}
      <group position={[0, 0.68, -0.05]} rotation={[0.2, 0, 0]}>
        <mesh material={fabricMaterial} castShadow>
          <sphereGeometry args={[0.38, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        </mesh>
        {/* Thick Double-Lined Hood Collar Rim */}
        <mesh position={[0, -0.12, 0.16]} rotation={[Math.PI / 2, 0, 0]} material={fabricMaterial}>
          <torusGeometry args={[0.28, 0.06, 16, 32]} />
        </mesh>
      </group>

      {/* 3D Kangaroo Pouch Pocket on Lower Abdomen */}
      <group position={[0, -0.32, 0.36]} rotation={[-0.05, 0, 0]}>
        <mesh material={fabricMaterial} castShadow>
          <boxGeometry args={[0.62, 0.32, 0.08]} />
        </mesh>
        {/* Left Hand Opening Slit */}
        <mesh position={[-0.32, 0, 0]} rotation={[0, 0.4, 0]} material={fabricMaterial}>
          <boxGeometry args={[0.04, 0.28, 0.06]} />
        </mesh>
        {/* Right Hand Opening Slit */}
        <mesh position={[0.32, 0, 0]} rotation={[0, -0.4, 0]} material={fabricMaterial}>
          <boxGeometry args={[0.04, 0.28, 0.06]} />
        </mesh>
      </group>

      {/* Hanging Braided Drawstrings with Metal Aglets */}
      <group position={[-0.08, 0.46, 0.36]} rotation={[0, 0, -0.05]}>
        <mesh material={fabricMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.36, 12]} />
        </mesh>
        {/* Metal Tip */}
        <mesh position={[0, -0.19, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.04, 12]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.08, 0.46, 0.36]} rotation={[0, 0, 0.05]}>
        <mesh material={fabricMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.36, 12]} />
        </mesh>
        {/* Metal Tip */}
        <mesh position={[0, -0.19, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.04, 12]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// --------------------------------------------------------------------------
// 3. STREETWEAR PANTS (Cargos, Sweatpants, Denim Jeans, Shorts)
// --------------------------------------------------------------------------
interface PantsProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  category: string;
}

function RealisticPantsModel({ fabricMaterial, frontTex, backTex, category }: PantsProps) {
  const isCargos = category === 'WIDE_LEG_CARGO_PANTS';
  const isJeans = category === 'RELAXED_DENIM_JEANS';
  const isShorts = category === 'FLEECE_SHORTS';

  const legLength = isShorts ? 0.65 : 1.55;
  const legY = isShorts ? -0.45 : -0.85;

  return (
    <group position={[0, 0.45, 0]}>
      {/* Contoured Waistband */}
      <mesh material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.56, 0.58, 0.36, 32]} />
      </mesh>

      {/* Fly Seam & Belt Loops */}
      <mesh position={[0, 0, 0.59]} material={fabricMaterial}>
        <boxGeometry args={[0.04, 0.32, 0.02]} />
      </mesh>

      {/* Left Leg with Natural Taper */}
      <mesh position={[-0.27, legY, 0]} material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[isShorts ? 0.28 : 0.27, isShorts ? 0.3 : 0.23, legLength, 24]} />
      </mesh>

      {/* Right Leg with Natural Taper */}
      <mesh position={[0.27, legY, 0]} material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[isShorts ? 0.28 : 0.27, isShorts ? 0.3 : 0.23, legLength, 24]} />
      </mesh>

      {/* 3D Cargo Bellow Pockets on Outer Thighs (Cargo Pants) */}
      {isCargos && (
        <>
          <group position={[-0.58, -0.65, 0]}>
            <mesh material={fabricMaterial} castShadow>
              <boxGeometry args={[0.1, 0.36, 0.26]} />
            </mesh>
            {/* Pocket Flap */}
            <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.15]} material={fabricMaterial}>
              <boxGeometry args={[0.12, 0.08, 0.28]} />
            </mesh>
          </group>

          <group position={[0.58, -0.65, 0]}>
            <mesh material={fabricMaterial} castShadow>
              <boxGeometry args={[0.1, 0.36, 0.26]} />
            </mesh>
            {/* Pocket Flap */}
            <mesh position={[0, 0.18, 0]} rotation={[0, 0, -0.15]} material={fabricMaterial}>
              <boxGeometry args={[0.12, 0.08, 0.28]} />
            </mesh>
          </group>
        </>
      )}

      {/* 3D Denim Back Patch Pockets (Jeans) */}
      {isJeans && (
        <>
          <mesh position={[-0.24, 0.02, -0.59]} rotation={[0, Math.PI, 0]} material={fabricMaterial}>
            <boxGeometry args={[0.24, 0.24, 0.02]} />
          </mesh>
          <mesh position={[0.24, 0.02, -0.59]} rotation={[0, Math.PI, 0]} material={fabricMaterial}>
            <boxGeometry args={[0.24, 0.24, 0.02]} />
          </mesh>
        </>
      )}

      {/* Left Thigh Graphic Decal */}
      {frontTex && (
        <mesh position={[-0.27, -0.35, 0.35]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.48, 0.6]} />
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

      {/* Back Hip Graphic Decal */}
      {backTex && (
        <mesh position={[0, 0.05, -0.6]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.55, 0.45]} />
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
    shirtScale = [2.75, 2.5, 2.75]; // Streetwear drop-shoulder cut
  } else if (activeGarment.category === 'REGULAR_TEE') {
    shirtScale = [2.45, 2.45, 2.45]; // Classic tailored fit
  } else if (activeGarment.category === 'BASKETBALL_JERSEY') {
    shirtScale = [2.35, 2.5, 2.35]; // Athletic cut
  } else if (activeGarment.category === 'CREWNECK_SWEATSHIRT') {
    shirtScale = [2.7, 2.55, 2.7]; // French terry boxy cut
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

      {/* 3. REALISTIC STREETWEAR PANTS / SHORTS */}
      {isPants && (
        <RealisticPantsModel
          fabricMaterial={fabricMaterial}
          frontTex={frontTex}
          backTex={backTex}
          category={activeGarment.category}
        />
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
