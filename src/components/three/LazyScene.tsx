'use client';

import dynamic from 'next/dynamic';

export const LazyHeroScene = dynamic(
  () => import('./Scene').then((mod) => ({ default: mod.HeroScene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-fuel-500/10 animate-pulse-slow" />
          <div className="absolute inset-4 rounded-full bg-fuel-500/20 animate-pulse" />
          <div className="absolute inset-8 rounded-full bg-fuel-500/30 animate-glow" />
          <div className="absolute inset-12 rounded-full bg-fuel-500/50" />
        </div>
      </div>
    ),
  }
);
