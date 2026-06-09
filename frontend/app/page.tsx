import { HeroSection } from '@/components/sections/HeroSection';
import { TrustAnchors } from '@/components/sections/TrustAnchors';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata = {
  title: 'Family Wealth Custodians - Wealth Management & Estate Planning',
  description: 'Expert retirement planning, estate management, and wealth preservation for South African families.',
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustAnchors />
      <ServicesSection />
      <FinalCTA />
    </>
  );
}
