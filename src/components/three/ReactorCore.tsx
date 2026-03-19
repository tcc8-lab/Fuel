'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ReactorCoreProps {
  progress: number;
}

export function ReactorCore({ progress }: ReactorCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0fc78e'),
        emissive: new THREE.Color('#0fc78e'),
        emissiveIntensity: 1.5 + progress * 2,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8,
      }),
    [progress]
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0fc78e'),
        emissive: new THREE.Color('#0fc78e'),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.3,
        roughness: 0.3,
        metalness: 0.9,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      // Camera-reactive positioning based on scroll
      groupRef.current.position.y = -progress * 3;
    }

    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.3;
      ringRef1.current.rotation.z = t * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = t * 0.4;
      ringRef2.current.rotation.x = Math.PI / 3;
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.z = -t * 0.2;
      ringRef3.current.rotation.x = -Math.PI / 4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core sphere */}
      <mesh ref={coreRef} material={coreMaterial}>
        <icosahedronGeometry args={[0.8, 4]} />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color="#0fc78e"
          emissive="#0fc78e"
          emissiveIntensity={0.8}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ringRef1} material={ringMaterial}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
      </mesh>
      <mesh ref={ringRef2} material={ringMaterial}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
      </mesh>
      <mesh ref={ringRef3} material={ringMaterial}>
        <torusGeometry args={[3.0, 0.01, 16, 100]} />
      </mesh>

      {/* Particle field */}
      <CoreParticles />
    </group>
  );
}

function CoreParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color('#0fc78e');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const intensity = 0.3 + Math.random() * 0.7;
      col[i * 3] = color.r * intensity;
      col[i * 3 + 1] = color.g * intensity;
      col[i * 3 + 2] = color.b * intensity;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
