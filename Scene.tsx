import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars, BakeShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { LuxuryTree } from './LuxuryTree';
import { AppState } from '../types';

interface SceneProps {
  appState: AppState;
}

export const Scene: React.FC<SceneProps> = ({ appState }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 11], fov: 40 }} // Slightly further back for the explosion effect
      dpr={[1, 2]} 
      gl={{ 
          antialias: false, 
          toneMappingExposure: 1.2,
          powerPreference: "high-performance"
      }} 
    >
      <color attach="background" args={['#021a14']} />
      
      <Suspense fallback={null}>
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.4} color="#002b18" />
        
        {/* Main Key Light - Warm Gold */}
        <spotLight
          position={[10, 15, 10]}
          angle={0.2}
          penumbra={1}
          intensity={2.5}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[2048, 2048]}
          color="#ffebbd"
        />
        
        {/* Rim Light - Cool Blue/White for contrast against Emerald */}
        <spotLight
          position={[-10, 5, -8]}
          angle={0.3}
          penumbra={1}
          intensity={3}
          color="#c2e0ff"
        />
        
        {/* Fill light from below */}
        <pointLight position={[0, -5, 5]} intensity={0.8} color="#d4af37" />

        {/* Environment for shiny reflections */}
        <Environment preset="city" />

        {/* The Tree */}
        <group rotation={[0, 0, 0]}>
             <LuxuryTree layoutMode={appState.layoutMode} />
        </group>

        {/* Floor Reflections */}
        <ContactShadows
          resolution={1024}
          scale={30}
          blur={2.5}
          opacity={0.4}
          far={15}
          color="#000000"
        />

        {/* Background */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <BakeShadows />
      </Suspense>

      {/* Cinematic Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={1} 
            mipmapBlur 
            intensity={appState.bloomIntensity} 
            radius={0.7}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.03} /> 
      </EffectComposer>

      <OrbitControls 
        autoRotate={appState.isPlaying}
        autoRotateSpeed={appState.rotationSpeed}
        enablePan={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={5}
        maxDistance={20}
      />
    </Canvas>
  );
};