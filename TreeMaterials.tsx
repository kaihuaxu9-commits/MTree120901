import React from 'react';
import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three';

// Luxurious Emerald Material: High transmission (glass-like), deep color, clearcoat
export const EmeraldMaterial = () => (
  <meshPhysicalMaterial
    color="#065f46"
    emissive="#022c22"
    emissiveIntensity={0.5}
    roughness={0.15}
    metalness={0.6}
    reflectivity={1}
    clearcoat={1}
    clearcoatRoughness={0.1}
    transmission={0.1}
    thickness={2}
    envMapIntensity={2}
  />
);

// High Polish Gold: High metalness, low roughness
export const GoldMaterial = () => (
  <meshStandardMaterial
    color="#FFD700"
    roughness={0.1}
    metalness={1}
    envMapIntensity={2.5}
  />
);

// Optimized Needle Material for InstancedMesh (No transmission for performance, high metalness for shimmer)
export const NeedleMaterial = () => (
  <meshStandardMaterial
    color="#064e3b" // Emerald 800
    emissive="#022c22" // Darker emissive for depth
    emissiveIntensity={0.2}
    roughness={0.2}
    metalness={0.9} // Metallic look for "Jewel" shards
    envMapIntensity={1.5}
  />
);

// Glowing Light Material
export const LightMaterial = ({ color, intensity = 1 }: { color: string; intensity?: number }) => (
  <meshStandardMaterial
    color={color}
    emissive={color}
    emissiveIntensity={intensity * 3}
    toneMapped={false}
  />
);