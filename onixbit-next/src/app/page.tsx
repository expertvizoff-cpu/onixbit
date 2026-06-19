import {
  ApproachSection,
  ArticlesPreview,
  CasesPreview,
  DirectionsSection,
  LeadSection,
  ProofStrip,
  TestimonialsSection,
} from "@/components/Sections";
import { HomeHero } from "@/components/HomeHero";

export default function Home() {
  return (
    <>
      <HomeHero />
      <ProofStrip />
      <DirectionsSection />
      <ApproachSection />
      <CasesPreview />
      <TestimonialsSection />
      <ArticlesPreview />
      <LeadSection />
    </>
  );
}
