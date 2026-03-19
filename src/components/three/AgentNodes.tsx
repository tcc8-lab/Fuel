'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AgentNodesProps {
  progress: number;
  visible: boolean;
}

export function AgentNodes({ progress, visible }: AgentNodesProps) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const count = 8;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 4;
      return {
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const targetOpacity = visible ? 1 : 0;
      const current = groupRef.current.children[0]?.visible ? 1 : 0;
      groupRef.current.visible = visible;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.position.y = -progress * 3;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <AgentNode key={i} {...node} index={i} />
      ))}
    </group>
  );
}

function AgentNode({
  position,
  speed,
  phase,
  index,
}: {
  position: [number, number, number];
  speed: number;
  phase: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.3;
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = t * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.3;
      const scale = 1 + Math.sin(t * 2 + phase) * 0.2;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const color = index % 2 === 0 ? '#06b6d4' : '#8b5cf6';

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
