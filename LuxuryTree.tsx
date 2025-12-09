import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3, Euler, Matrix4, Quaternion, Color, InstancedMesh, Object3D } from 'three';
import { Float, Sparkles, Instance, Instances } from '@react-three/drei';
import { NeedleMaterial, GoldMaterial, EmeraldMaterial } from './TreeMaterials';
import { GoldBauble, DiamondOrnament, GlowingLight } from './Ornaments';

// --- Math Helpers ---

const getRandomSpherePos = (r: number): [number, number, number] => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  const rad = Math.cbrt(Math.random()) * r; 
  return [
    rad * Math.sin(phi) * Math.cos(theta),
    rad * Math.sin(phi) * Math.sin(theta),
    rad * Math.cos(phi)
  ];
};

// --- Needle Particle System ---

const NEEDLE_COUNT = 1800;
const GOLD_RATIO = 0.15; // 15% of needles are gold

interface ParticleData {
  treePos: Vector3;
  scatterPos: Vector3;
  treeRot: Quaternion;
  scatterRot: Quaternion;
  scale: Vector3;
  isGold: boolean;
}

const NeedleParticles = ({ layoutMode }: { layoutMode: 'tree' | 'scattered' }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useMemo(() => new Object3D(), []);
  
  // Generate Data Once
  const particles = useMemo(() => {
    const data: ParticleData[] = [];
    const height = 8;
    const baseRadius = 2.8;

    for (let i = 0; i < NEEDLE_COUNT; i++) {
      // Tree Shape: Cone distribution
      const y = MathUtils.randFloat(-3.5, 4.5); // Tree height range
      const normHeight = (y + 3.5) / height; // 0 to 1
      const radiusAtHeight = baseRadius * (1 - normHeight) * MathUtils.randFloat(0.8, 1.2); // Add noise to radius
      const theta = MathUtils.randFloat(0, Math.PI * 2);
      
      const x = radiusAtHeight * Math.cos(theta);
      const z = radiusAtHeight * Math.sin(theta);
      
      const treePos = new Vector3(x, y, z);
      
      // Tree Rotation: Pointing outwards and slightly up
      const treeRotObj = new Object3D();
      treeRotObj.position.set(0, y, 0); // Center axis at height
      treeRotObj.lookAt(x, y + 0.5, z); // Look at position
      const treeRot = treeRotObj.quaternion.clone();

      // Scatter Shape: Random sphere
      const sp = getRandomSpherePos(9);
      const scatterPos = new Vector3(...sp);
      
      // Scatter Rotation: Random
      const scatterRotObj = new Object3D();
      scatterRotObj.rotation.set(
          Math.random() * Math.PI, 
          Math.random() * Math.PI, 
          Math.random() * Math.PI
      );
      const scatterRot = scatterRotObj.quaternion.clone();

      // Scale: Elongated shards
      const scale = new Vector3(
          MathUtils.randFloat(0.05, 0.1), 
          MathUtils.randFloat(0.3, 0.6), 
          MathUtils.randFloat(0.05, 0.1)
      );

      data.push({
        treePos,
        scatterPos,
        treeRot,
        scatterRot,
        scale,
        isGold: Math.random() < GOLD_RATIO
      });
    }
    return data;
  }, []);

  // Initialize Colors
  useLayoutEffect(() => {
    if (meshRef.current) {
      const colorEmerald = new Color("#064e3b");
      const colorGold = new Color("#FFD700");
      const colorVibrant = new Color("#10b981"); // Highlights
      
      particles.forEach((p, i) => {
        if (p.isGold) {
           meshRef.current!.setColorAt(i, colorGold);
        } else {
           // Vary emerald shades
           const c = Math.random() > 0.8 ? colorVibrant : colorEmerald;
           meshRef.current!.setColorAt(i, c);
        }
      });
      
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [particles]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Target interpolation factor
    const targetFactor = layoutMode === 'tree' ? 1 : 0;
    
    const mesh = meshRef.current;
    if (mesh.userData.morphFactor === undefined) mesh.userData.morphFactor = targetFactor; // Start at target to avoid jump
    
    mesh.userData.morphFactor = MathUtils.damp(mesh.userData.morphFactor, targetFactor, 3, delta);
    const m = mesh.userData.morphFactor;

    const time = state.clock.elapsedTime;

    for (let i = 0; i < NEEDLE_COUNT; i++) {
      const p = particles[i];
      
      // Lerp Position
      tempObject.position.lerpVectors(p.scatterPos, p.treePos, m);
      
      // Add floating noise when scattered
      if (m < 0.95) {
          const noiseFreq = 0.5;
          const noiseAmp = (1 - m) * 0.5;
          tempObject.position.y += Math.sin(time * noiseFreq + p.scatterPos.x) * noiseAmp;
          tempObject.position.x += Math.cos(time * noiseFreq + p.scatterPos.y) * noiseAmp * 0.5;
      }

      // Lerp Rotation
      tempObject.quaternion.slerpQuaternions(p.scatterRot, p.treeRot, m);
      
      // Scale
      tempObject.scale.copy(p.scale);
      
      // Update Matrix
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NEEDLE_COUNT]} castShadow receiveShadow>
      <tetrahedronGeometry args={[1, 0]} /> {/* Jewel shape */}
      <NeedleMaterial />
    </instancedMesh>
  );
};


// --- Ornament Wrapper for Morphing ---

const MorphingOrnament = ({ 
    children, 
    treePos, 
    scatterPos, 
    layoutMode, 
    delay = 0 
}: { 
    children: React.ReactNode, 
    treePos: [number, number, number], 
    scatterPos: [number, number, number],
    layoutMode: 'tree' | 'scattered',
    delay?: number
}) => {
    const groupRef = useRef<Group>(null);
    const morphRef = useRef(layoutMode === 'tree' ? 1 : 0);

    useFrame((state, delta) => {
        if(!groupRef.current) return;

        const target = layoutMode === 'tree' ? 1 : 0;
        
        morphRef.current = MathUtils.damp(morphRef.current, target, 2.5, delta);
        
        const m = morphRef.current;
        
        const tPos = new Vector3(...treePos);
        const sPos = new Vector3(...scatterPos);
        
        // Lerp
        groupRef.current.position.lerpVectors(sPos, tPos, m);
    });

    return <group ref={groupRef}>{children}</group>;
};


// --- Main Tree Component ---

export const LuxuryTree = ({ layoutMode }: { layoutMode: 'tree' | 'scattered' }) => {
  
  // Generate Data for Ornaments
  const ornaments = useMemo(() => {
    const items = [];
    const height = 7.5;
    const turns = 5;
    const count = 70; 

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns;
      const y = (t * height) - (3.5) + (Math.random() * 0.5); // Spread along height
      const radiusBase = 2.9;
      const radius = radiusBase * (1 - t * 0.9) + 0.2; 
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      items.push({ 
          id: i,
          treePos: [x, y, z] as [number, number, number], 
          scatterPos: getRandomSpherePos(8),
          type: i % 4 === 0 ? 'diamond' : i % 3 === 0 ? 'gold' : 'light',
          scale: MathUtils.randFloat(0.1, 0.2)
      });
    }
    return items;
  }, []);

  return (
    <group>
        {/* Core Structure - The Needle Particles */}
        <NeedleParticles layoutMode={layoutMode} />

        {/* Ornaments */}
        <group>
            {ornaments.map((o) => (
                <MorphingOrnament
                    key={`ornament-${o.id}`}
                    layoutMode={layoutMode}
                    treePos={o.treePos}
                    scatterPos={o.scatterPos}
                >
                    {o.type === 'gold' && <GoldBauble position={[0,0,0]} scale={o.scale * 1.2} />}
                    {o.type === 'diamond' && <DiamondOrnament position={[0,0,0]} scale={o.scale} />}
                    {o.type === 'light' && <GlowingLight position={[0,0,0]} color="#fff0bd" scale={0.08} />}
                </MorphingOrnament>
            ))}
        </group>

        {/* Topper */}
        <MorphingOrnament
            layoutMode={layoutMode}
            treePos={[0, 4.6, 0]}
            scatterPos={[0, 8, 0]}
        >
            <Float speed={4} rotationIntensity={0.5} floatIntensity={0.2}>
                <DiamondOrnament position={[0, 0, 0]} scale={0.5} />
                <Sparkles count={30} scale={2} size={6} speed={0.4} opacity={1} color="#FFD700" />
            </Float>
            <pointLight intensity={2} distance={8} color="#ffffff" decay={2} />
        </MorphingOrnament>

        {/* Base Pot */}
        <MorphingOrnament
             layoutMode={layoutMode}
             treePos={[0, -3.8, 0]}
             scatterPos={[0, -9, 0]}
        >
            <mesh receiveShadow castShadow>
                <cylinderGeometry args={[0.6, 0.9, 1.2, 8]} />
                <GoldMaterial />
            </mesh>
        </MorphingOrnament>

        {/* Dynamic Atmosphere Sparkles */}
        <group position={[0, 0, 0]}>
            <Sparkles count={100} size={4} speed={0.2} opacity={0.5} color="#FFD700" scale={10} />
        </group>
    </group>
  );
};