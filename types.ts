import React from 'react';

export type ThemeColor = 'gold' | 'emerald' | 'ruby' | 'sapphire';

export interface AppState {
  rotationSpeed: number;
  lightsIntensity: number;
  bloomIntensity: number;
  isPlaying: boolean;
  layoutMode: 'tree' | 'scattered';
}

export interface OrnamentProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  type: 'sphere' | 'diamond' | 'star';
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshPhysicalMaterial: any;
      meshStandardMaterial: any;
      instancedMesh: any;
      tetrahedronGeometry: any;
      group: any;
      pointLight: any;
      mesh: any;
      cylinderGeometry: any;
      color: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}
