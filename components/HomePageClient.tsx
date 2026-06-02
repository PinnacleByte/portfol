'use client';

import { useRef } from 'react';
import type { Project, TeamMember } from '@/types';
import Navbar from '@/components/ui/Navbar';
import IntroSplashSection from '@/components/sections/IntroSplashSection';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessTimelineSection from '@/components/sections/ProcessTimelineSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import PricingSection from '@/components/sections/PricingSection';
import TeamSection from '@/components/sections/TeamSection';
import TrustSection from '@/components/sections/TrustSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';
import Footer from '@/components/ui/Footer';
import { useSnapScroll } from '@/hooks/useSnapScroll';
import SnapScrollContainer from '@/components/SnapScrollContainer';

interface HomePageClientProps {
  projects: Project[];
  team: TeamMember[];
}

export default function HomePageClient({ projects, team }: HomePageClientProps) {
  const processTimelinePanelRef = useRef<HTMLDivElement | null>(null);
  const workPanelRef = useRef<HTMLDivElement | null>(null);

  const { currentIndex, goTo, isDesktop } = useSnapScroll({
    totalSections: 9,
    internalScrollSections: [
      { index: 3, panelRef: processTimelinePanelRef },
      { index: 4, panelRef: workPanelRef },
    ],
  });

  const sections = [
    <IntroSplashSection key="intro" />,
    <HeroSection key="hero" />,
    <ServicesSection key="services" />,
    <ProcessTimelineSection key="process" scrollPanelRef={processTimelinePanelRef} />,
    <PortfolioSection key="work" scrollPanelRef={workPanelRef} projects={projects} />,
    <PricingSection key="pricing" goTo={isDesktop ? goTo : undefined} />,
    <TeamSection key="team" team={team} />,
    <TrustSection key="trust" goTo={isDesktop ? goTo : undefined} />,
    <FinalCtaSection key="cta" />,
  ];

  // Mobile fallback: regular stacked layout
  if (!isDesktop) {
    return (
      <main className="space-y-0">
        <Navbar />
        {/* Spacer so content starts below the fixed navbar */}
        <div className="h-[57px]" />
        {sections}
        <Footer />
      </main>
    );
  }

  // Desktop: snap scroll layout
  return (
    <>
      <Navbar goTo={goTo} visible={currentIndex > 0} />
      <SnapScrollContainer currentIndex={currentIndex} isDesktop={isDesktop}>
        {sections}
      </SnapScrollContainer>
    </>
  );
}
