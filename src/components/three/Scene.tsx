'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { ReactorCore } from './ReactorCore';
import { AgentNodes } from './AgentNodes';
import { CreditStreams } from './CreditStreams';
import { ComputeCluster } from './ComputeCluster';

interface SceneProps {
  scrollProgress: number;
}

function SceneContent({ scrollProgress }: SceneProps) {
  const section = Math.floor(scrollProgress * 4);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#0fc78e" distance={20} />
      <pointLight position={[5, 3, -2]} intensity={0.5} color="#06b6d4" distance={15} />
      <pointLight position={[-5, -3, 2]} intensity={0.3} color="#8b5cf6" distance={15} />

      <ReactorCore progress={scrollProgress} />
      <AgentNodes progress={scrollProgress} visible={section >= 1} />
      <CreditStreams progress={scrollProgress} visible={section >= 2} />
      <ComputeCluster progress={scrollProgress} visible={section >= 3} />

      <Environment preset="night" />
      <Preload all />
    </>
  );
}

function FallbackScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-fuel-500/10 animate-pulse-slow" />
        <div className="absolute inset-4 rounded-full bg-fuel-500/20 animate-pulse" />
        <div className="absolute inset-8 rounded-full bg-fuel-500/30 animate-glow" />
        <div className="absolute inset-12 rounded-full bg-fuel-500/50" />
      </div>
    </div>
  );
}

export function HeroScene({ scrollProgress }: SceneProps) {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    // Check WebGL support and performance
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        setCanRender3D(true);
      }
    } catch {
      setCanRender3D(false);
    }
  }, []);

  if (!canRender3D) {
    return <FallbackScene />;
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
