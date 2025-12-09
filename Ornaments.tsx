import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Octahedron, Sphere } from '@react-three/drei';
import { GoldMaterial, LightMaterial } from './TreeMaterials';

interface BaubleProps {
  position: [number, number, number];
  scale?: number;
}

export const GoldBauble: React.FC<BaubleProps> = ({ position, scale = 0.15 }) => {
  return (
    <Sphere args={[1, 32, 32]} position={position} scale={scale}>
      <GoldMaterial />
    </Sphere>
  );
};

export const DiamondOrnament: React.FC<BaubleProps> = ({ position, scale = 0.12 }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Octahedron ref={meshRef} args={[1, 0]} position={position} scale={scale}>
      <meshPhysicalMaterial 
        color="#ffffff" 
        transmission={0.9} 
        roughness={0} 
        thickness={3} 
        ior={2.4} 
        chromaticAberration={0.04} // Diamond effect
        clearcoat={1}
      />
    </Octahedron>
  );
};

export const GlowingLight: React.FC<BaubleProps & { color: string; flicker?: boolean }> = ({ position, color, scale = 0.05, flicker = true }) => {
  const ref = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (flicker && ref.current) {
        // Subtle breathing effect
        const t = state.clock.elapsedTime;
        const scaleBase = scale;
        const scaleVar = Math.sin(t * 3 + position[0]) * 0.01;
        ref.current.scale.setScalar(scaleBase + scaleVar);
        
        // Random slight intensity flicker handled by post-proc usually, but we simulate via scale/emissive visual
    }
  });

  return (
    <Sphere ref={ref} args={[1, 16, 16]} position={position} scale={scale}>
      <LightMaterial color={color} intensity={2} />
    </Sphere>
  );
};
