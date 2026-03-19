'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { ProtocolExplainer } from '@/components/home/ProtocolExplainer';
import { TokenUtility } from '@/components/home/TokenUtility';
import { DashboardPreview } from '@/components/home/DashboardPreview';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProtocolExplainer />
      <TokenUtility />
      <DashboardPreview />
      <CTASection />
    </>
  );
}
