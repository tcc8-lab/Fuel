'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CreditStreamsProps {
  progress: number;
  visible: boolean;
}

export function CreditStreams({ progress, visible }: CreditStreamsProps) {
  const groupRef = useRef<THREE.Group>(null);

  const streams = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return {
        startAngle: angle,
        speed: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        radius: 3 + Math.random() * 1.5,
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -progress * 3;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <StreamLine key={i} {...stream} />
      ))}
    </group>
  );
}

function StreamLine({
  startAngle,
  speed,
  phase,
  radius,
}: {
  startAngle: number;
  speed: number;
  phase: number;
  radius: number;
}) {
  const lineRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const r = radius * (1 - t * 0.7);
      const angle = startAngle + t * 0.5;
      const spiralY = (t - 0.5) * 2;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = spiralY;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }

    return pos;
  }, [startAngle, radius]);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * speed + phase;
    }
  });

  return (
    <points ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#0fc78e"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}
