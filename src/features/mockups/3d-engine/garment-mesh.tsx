'use client';

import { useMemo, useEffect, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF, Decal } from '@react-three/drei';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStudioStore } from '@/stores/studio-store';
import { useMockupStore } from '@/stores/mockup-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { texturePipeline } from '@/features/studio/canvas-2d/texture-pipeline';

// Preload authentic 3D garment GLB assets into cache
if (typeof window !== 'undefined') {
  try {
    useGLTF.preload('/models/shirt.glb');
    useGLTF.preload('/models/hoodie.glb');
    useGLTF.preload('/models/cargo.glb');
    useGLTF.preload('/models/sweatpants.glb');
    useGLTF.preload('/models/jeans.glb');
    useGLTF.preload('/models/shorts.glb');
  } catch {}
}

// Authentic micro-weave fabric normal bump texture generator
function createFabricNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(256, 256);
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
  texture.repeat.set(32, 32);
  texture.needsUpdate = true;
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
    const meshNode =
      nodes?.T_Shirt_male ||
      nodes?.['T-Shirt'] ||
      nodes?.Object_4 ||
      Object.values(nodes).find((n: any) => n.isMesh);

    if (meshNode?.geometry) {
      const geom = meshNode.geometry.clone();
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
// 2. AUTHENTIC 3D GLTF HOODIE (Real Single-Mesh Heavyweight Streetwear Hoodie)
// --------------------------------------------------------------------------
interface HoodieProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  pbrRoughness: number;
}

function RealHoodieModel({ fabricMaterial, frontTex, backTex, pbrRoughness }: HoodieProps) {
  const gltf = useGLTF('/models/hoodie.glb') as any;

  const hoodieGeometry = useMemo(() => {
    if (!gltf?.scene) return null;
    const geoms: THREE.BufferGeometry[] = [];
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        const matName = child.material?.name?.toLowerCase() || '';
        if (!matName.includes('skin')) {
          const g = child.geometry.clone();
          if (!g.attributes.normal) g.computeVertexNormals();
          geoms.push(g);
        }
      }
    });

    if (geoms.length === 0) return null;
    const merged = geoms.length === 1 ? geoms[0] : mergeGeometries(geoms, false);
    merged.center();
    // Raw hoodie model coordinates are in centimeters (127.7cm width x 79.6cm height x 44.1cm depth)
    // Scale by 0.01 to convert directly to standard 3D metric units (1.28m width x 0.80m height)
    merged.scale(0.01, 0.01, 0.01);
    merged.computeVertexNormals();
    return merged;
  }, [gltf]);

  if (!hoodieGeometry) return null;

  return (
    <group position={[0, 0.08, 0]} scale={[2.0, 2.0, 2.0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={hoodieGeometry}
        material={fabricMaterial}
        dispose={null}
      >
        {/* Front Chest Graphic Decal wrapped seamlessly onto 3D hoodie surface */}
        {frontTex && (
          <Decal
            position={[0, 0.06, 0.23]}
            rotation={[0, 0, 0]}
            scale={[0.30, 0.36, 0.30]}
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

        {/* Full Back Graphic Decal wrapped onto back of hoodie */}
        {backTex && (
          <Decal
            position={[0, 0.06, -0.23]}
            rotation={[0, Math.PI, 0]}
            scale={[0.30, 0.36, 0.30]}
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
// 3. AUTHENTIC 3D GLTF PANTS & SHORTS (Cargos, Sweatpants, Denim Jeans, Shorts)
// --------------------------------------------------------------------------
interface PantsProps {
  fabricMaterial: THREE.Material;
  frontTex: THREE.Texture | null;
  backTex: THREE.Texture | null;
  category: string;
}

function RealPantsModel({ fabricMaterial, frontTex, backTex, category }: PantsProps) {
  const isJeans = category === 'RELAXED_DENIM_JEANS';
  const isShorts = category === 'FLEECE_SHORTS';
  const isSweatpants = category === 'HEAVYWEIGHT_SWEATPANTS';
  const isCargos = category === 'WIDE_LEG_CARGO_PANTS';

  const modelPath = isJeans
    ? '/models/jeans.glb'
    : isShorts
    ? '/models/shorts.glb'
    : isSweatpants
    ? '/models/sweatpants.glb'
    : '/models/cargo.glb';

  const gltf = useGLTF(modelPath) as any;

  const pantsGeometry = useMemo(() => {
    if (!gltf?.scene) return null;
    const geoms: THREE.BufferGeometry[] = [];
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        const matName = child.material?.name?.toLowerCase() || '';
        // Filter out avatar skin/body mesh to leave 100% pure garment cloth
        if (!matName.includes('skin')) {
          const g = child.geometry.clone();
          if (!g.attributes.normal) g.computeVertexNormals();
          geoms.push(g);
        }
      }
    });

    if (geoms.length === 0) return null;
    const merged = geoms.length === 1 ? geoms[0] : mergeGeometries(geoms, false);
    merged.center();
    merged.computeVertexNormals();
    return merged;
  }, [gltf]);

  if (!pantsGeometry) return null;

  // Authentic streetwear proportions matching the tee and hoodie
  const scale: [number, number, number] = isShorts
    ? [2.1, 2.1, 2.1]
    : isCargos
    ? [1.9, 1.9, 1.9]
    : isSweatpants
    ? [1.85, 1.85, 1.85]
    : [1.88, 1.88, 1.88];

  const posY = isShorts ? -0.2 : -0.1;

  // Decal positions: front thigh placement and rear pocket placement
  const decalFrontPos: [number, number, number] = isShorts
    ? [-0.11, -0.02, 0.16]
    : isCargos
    ? [-0.10, 0.12, 0.17]
    : [-0.09, 0.13, 0.16];

  const decalFrontScale: [number, number, number] = isShorts
    ? [0.14, 0.14, 0.14]
    : [0.15, 0.20, 0.16];

  const decalBackPos: [number, number, number] = isShorts
    ? [0.11, 0.05, -0.16]
    : [0.10, 0.25, -0.16];

  const decalBackScale: [number, number, number] = [0.14, 0.14, 0.14];

  return (
    <group position={[0, posY, 0]} scale={scale}>
      <mesh
        castShadow
        receiveShadow
        geometry={pantsGeometry}
        material={fabricMaterial}
        dispose={null}
      >
        {/* Front Thigh Graphic Decal */}
        {frontTex && (
          <Decal
            position={decalFrontPos}
            rotation={[0, 0, 0]}
            scale={decalFrontScale}
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

        {/* Back Hip / Pocket Graphic Decal */}
        {backTex && (
          <Decal
            position={decalBackPos}
            rotation={[0, Math.PI, 0]}
            scale={decalBackScale}
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

      {/* 2. REAL 3D HEAVYWEIGHT HOODIE (100% GLB Mesh) */}
      {isHoodie && (
        <Suspense fallback={null}>
          <RealHoodieModel
            fabricMaterial={fabricMaterial}
            frontTex={frontTex}
            backTex={backTex}
            pbrRoughness={pbr.roughness}
          />
        </Suspense>
      )}

      {/* 3. REAL 3D PANTS / JEANS / SHORTS (100% GLB Mesh) */}
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
