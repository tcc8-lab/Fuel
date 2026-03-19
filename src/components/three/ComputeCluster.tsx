'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ComputeClusterProps {
  progress: number;
  visible: boolean;
}

export function ComputeCluster({ progress, visible }: ComputeClusterProps) {
  const groupRef = useRef<THREE.Group>(null);

  const cubes = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const r = 5;
      return {
        position: [
          Math.cos(angle) * r,
          (Math.random() - 0.5) * 1.5,
          Math.sin(angle) * r,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.2,
        rotationSpeed: 0.2 + Math.random() * 0.3,
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -progress * 3;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <ClusterNode key={i} {...cube} index={i} />
      ))}
    </group>
  );
}

function ClusterNode({
  position,
  scale,
  rotationSpeed,
  index,
}: {
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const colors = ['#f59e0b', '#06b6d4', '#8b5cf6', '#0fc78e', '#ec4899', '#06b6d4'];
  const color = colors[index % colors.length];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * rotationSpeed;
      meshRef.current.rotation.z = t * rotationSpeed * 0.7;
      meshRef.current.position.y = position[1] + Math.sin(t + index) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Wireframe outline */}
      <mesh scale={scale * 1.2}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}
