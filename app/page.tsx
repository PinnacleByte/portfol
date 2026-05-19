'use client';

import { useRef } from 'react';
import Navbar from '@/components/ui/Navbar';
import IntroSplashSection from '@/components/sections/IntroSplashSection';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessTimelineSection from '@/components/sections/ProcessTimelineSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import TeamSection from '@/components/sections/TeamSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';
import Footer from '@/components/ui/Footer';
import { useSnapScroll } from '@/hooks/useSnapScroll';
import SnapScrollContainer from '@/components/SnapScrollContainer';

export default function HomePage() {
  const processTimelinePanelRef = useRef<HTMLDivElement | null>(null);
  const workPanelRef = useRef<HTMLDivElement | null>(null);

  const { currentIndex, goTo, isDesktop } = useSnapScroll({
    totalSections: 8,
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
    <PortfolioSection key="work" scrollPanelRef={workPanelRef} />,
    <TeamSection key="team" />,
    <TestimonialsSection key="testimonials" />,
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
