'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useMockupStore } from '@/stores/mockup-store';
import { BackgroundModelType, EnvironmentPreset } from '@/types/mockup';

// ----------------------------------------------------------------------------
// 1. SHOWROOM PODIUM / DISPLAY PLINTH
// ----------------------------------------------------------------------------
function ShowroomPodium({ env }: { env: EnvironmentPreset }) {
  const isClean = env === 'studio_clean';
  const mainColor = isClean ? '#EAEBED' : '#101114';
  const baseColor = isClean ? '#DCDFE3' : '#090A0D';
  const ringColor = isClean ? '#4361EE' : '#E2F952'; // Volt neon or studio blue

  return (
    <group position={[0, -1.22, 0]}>
      {/* Top Main Plinth Surface */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.38, 0.16, 64]} />
        <meshStandardMaterial
          color={mainColor}
          roughness={isClean ? 0.35 : 0.45}
          metalness={isClean ? 0.1 : 0.3}
        />
      </mesh>

      {/* Recessed Glowing Accent Ring */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.22, 1.25, 64]} />
        <meshStandardMaterial
          color={ringColor}
          emissive={ringColor}
          emissiveIntensity={isClean ? 0.8 : 2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Stepped Lower Tier Base */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.48, 1.55, 0.14, 64]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 2. STUDIO CYCLORAMA / INFINITE CURVED BACKDROP
// ----------------------------------------------------------------------------
function StudioCycWall({ env }: { env: EnvironmentPreset }) {
  const isClean = env === 'studio_clean';
  const cycColor = isClean ? '#F5F6F8' : env === 'urban_street' ? '#14161A' : '#0B0C0E';

  // Create curved cyc geometry that sweeps from floor seamlessly into vertical wall
  const cycGeometry = useMemo(() => {
    const width = 14;
    const height = 7;
    const depth = 8;
    const curveRadius = 2.2;
    const segments = 48;

    const shape = new THREE.Shape();
    // Start at floor in front
    shape.moveTo(-width / 2, depth / 2);
    shape.lineTo(width / 2, depth / 2);
    // Flat floor back to curve start
    // We will build a smooth parametric sweep using a Plane or Extrusion
    return null;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Infinite curved backdrop mesh */}
      <mesh position={[0, 1.8, -3.2]} receiveShadow>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial
          color={cycColor}
          roughness={0.85}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ground transition bevel plane */}
      <mesh position={[0, -1.0, -2.6]} rotation={[-Math.PI / 4, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 1.8]} />
        <meshStandardMaterial
          color={cycColor}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 3. PHOTOGRAPHY STUDIO SOFTBOX DIFFUSER LIGHT STANDS
// ----------------------------------------------------------------------------
function PhotographySoftboxes({ env }: { env: EnvironmentPreset }) {
  const isClean = env === 'studio_clean';
  const standColor = '#18191C';
  const diffuserColor = '#FFFFFF';

  return (
    <group>
      {/* LEFT STUDIO SOFTBOX */}
      <group position={[-2.4, 0.4, -0.9]} rotation={[0.1, 0.75, 0]}>
        {/* Vertical Tripod Shaft */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.9, 16]} />
          <meshStandardMaterial color={standColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Tripod Base Legs */}
        {[-0.5, 0.5, 0].map((rot, i) => (
          <mesh
            key={i}
            position={[0, -1.25, 0]}
            rotation={[0, (i * Math.PI * 2) / 3, 0.45]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.65, 12]} />
            <meshStandardMaterial color={standColor} roughness={0.4} metalness={0.7} />
          </mesh>
        ))}
        {/* Softbox Housing (Rear Black Hood) */}
        <mesh position={[0, 0.65, 0]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.42, 0.5, 4]} />
          <meshStandardMaterial color="#0A0B0D" roughness={0.8} />
        </mesh>
        {/* Glowing Translucent Front Diffuser Face */}
        <mesh position={[0, 0.65, 0.24]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshStandardMaterial
            color={diffuserColor}
            emissive={diffuserColor}
            emissiveIntensity={isClean ? 1.0 : 1.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* RIGHT STUDIO SOFTBOX */}
      <group position={[2.4, 0.6, -0.8]} rotation={[0.08, -0.75, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2.1, 16]} />
          <meshStandardMaterial color={standColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Tripod Base Legs */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[0, -1.25, 0]}
            rotation={[0, (i * Math.PI * 2) / 3, 0.45]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.65, 12]} />
            <meshStandardMaterial color={standColor} roughness={0.4} metalness={0.7} />
          </mesh>
        ))}
        {/* Softbox Housing */}
        <mesh position={[0, 0.8, 0]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.45, 0.55, 4]} />
          <meshStandardMaterial color="#0A0B0D" roughness={0.8} />
        </mesh>
        {/* Glowing Diffuser Face */}
        <mesh position={[0, 0.8, 0.26]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.65, 0.85]} />
          <meshStandardMaterial
            color={diffuserColor}
            emissive={diffuserColor}
            emissiveIntensity={isClean ? 0.9 : 1.6}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 4. ARCHITECTURAL MANNEQUIN & HANGER DISPLAY STAND
// ----------------------------------------------------------------------------
function MannequinStand() {
  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Circular Cast-Iron Base */}
      <mesh position={[0, -1.33, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.04, 32]} />
        <meshStandardMaterial color="#121316" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Center Telescopic Stand Pole */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 1.72, 24]} />
        <meshStandardMaterial color="#2B2D33" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Industrial Adjustment Collar */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.05, 16]} />
        <meshStandardMaterial color="#E2F952" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Wooden / Matte Black Shoulder Hanger Crossbar */}
      <group position={[0, 0.38, 0]}>
        {/* Central neck block */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.09, 24]} />
          <meshStandardMaterial color="#201D1A" roughness={0.6} />
        </mesh>
        {/* Left shoulder hanger arm */}
        <mesh position={[-0.22, -0.03, 0]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.38, 0.035, 0.045]} />
          <meshStandardMaterial color="#1E1C1A" roughness={0.6} />
        </mesh>
        {/* Right shoulder hanger arm */}
        <mesh position={[0.22, -0.03, 0]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.38, 0.035, 0.045]} />
          <meshStandardMaterial color="#1E1C1A" roughness={0.6} />
        </mesh>
        {/* Top Metallic Suspension Finial */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial color="#C5CAD4" roughness={0.15} metalness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 5. BRUTALIST CONCRETE RUNWAY & CAD STAGE
// ----------------------------------------------------------------------------
function ConcreteRunway() {
  return (
    <group position={[0, -1.25, 0]}>
      {/* Elevated Concrete Stage Plinth */}
      <mesh position={[0, -0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.8, 0.18, 5.2]} />
        <meshStandardMaterial
          color="#1C1E23"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Left Hazard Strip */}
      <mesh position={[-1.85, 0.015, 0]}>
        <boxGeometry args={[0.08, 0.01, 5.2]} />
        <meshStandardMaterial
          color="#E2F952"
          emissive="#E2F952"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Right Hazard Strip */}
      <mesh position={[1.85, 0.015, 0]}>
        <boxGeometry args={[0.08, 0.01, 5.2]} />
        <meshStandardMaterial
          color="#E2F952"
          emissive="#E2F952"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Center Target Placement Crosshair */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.72, 32]} />
        <meshBasicMaterial color="#353942" />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 6. NEON CYBER GALLERY PILLARS
// ----------------------------------------------------------------------------
function NeonGallery() {
  const pillars = [
    [-2.2, 0.9, -1.6],
    [2.2, 0.9, -1.6],
    [-2.6, 0.9, 0.8],
    [2.6, 0.9, 0.8],
  ];

  return (
    <group>
      {/* 4 Architectural Concrete Pillars with Vertical Neon Recesses */}
      {pillars.map(([px, py, pz], i) => (
        <group key={i} position={[px, py, pz]}>
          {/* Main Pillar Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.38, 4.4, 0.38]} />
            <meshStandardMaterial color="#0E0F12" roughness={0.7} metalness={0.2} />
          </mesh>
          {/* Vertical Recessed Neon Light Strip */}
          <mesh position={[px > 0 ? -0.195 : 0.195, 0, 0]}>
            <boxGeometry args={[0.02, 3.8, 0.06]} />
            <meshStandardMaterial
              color="#E2F952"
              emissive="#E2F952"
              emissiveIntensity={3.0}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Floor Underglow Halo */}
      <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.56, 48]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 7. FLOOR CAD GRID & CONTACT SHADOW
// ----------------------------------------------------------------------------
function FloorGrid({ env }: { env: EnvironmentPreset }) {
  const isClean = env === 'studio_clean';
  const gridColor = isClean ? '#CBD1DC' : '#1C1F26';

  return (
    <group position={[0, -1.24, 0]}>
      {/* Floor Grid Pattern */}
      <gridHelper
        args={[10, 20, isClean ? '#9BA5B7' : '#E2F952', gridColor]}
        position={[0, 0.002, 0]}
      />

      {/* Dark Floor Plane for Ground Lighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color={isClean ? '#FFFFFF' : '#08090B'}
          roughness={isClean ? 0.4 : 0.65}
          metalness={isClean ? 0.05 : 0.15}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// MASTER BACKGROUND MODELS DISPATCHER
// ----------------------------------------------------------------------------
interface BackgroundModelsProps {
  model?: BackgroundModelType;
  env?: EnvironmentPreset;
}

export function BackgroundModels({ model, env: propEnv }: BackgroundModelsProps) {
  const {
    backgroundModel: storeModel,
    environmentPreset: storeEnv,
    showSoftboxes,
    showFloorGrid,
  } = useMockupStore();

  const activeModel = model || storeModel;
  const activeEnv = propEnv || storeEnv;

  if (activeModel === 'none') {
    return (
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={0.35} />
      </mesh>
    );
  }

  return (
    <group name="studio-background-models">
      {/* 1. Floor Base & Shadows */}
      {showFloorGrid && <FloorGrid env={activeEnv} />}

      {/* 2. Photography Studio Softboxes */}
      {showSoftboxes && (
        <PhotographySoftboxes env={activeEnv} />
      )}

      {/* 3. Infinite Studio Cyclorama Backdrop */}
      {activeModel === 'studio_cyc' && <StudioCycWall env={activeEnv} />}

      {/* 4. Showroom Display Podium */}
      {activeModel === 'podium' && <ShowroomPodium env={activeEnv} />}

      {/* 5. Architectural Mannequin Stand */}
      {activeModel === 'mannequin' && <MannequinStand />}

      {/* 6. Concrete Runway CAD Stage */}
      {activeModel === 'concrete_runway' && <ConcreteRunway />}

      {/* 7. Neon Cyber Gallery Pillars */}
      {activeModel === 'neon_gallery' && <NeonGallery />}
    </group>
  );
}
