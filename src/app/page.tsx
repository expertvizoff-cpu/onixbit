import {
  ApproachSection,
  ArticlesPreview,
  CasesPreview,
  DirectionsSection,
  LeadSection,
  ProofStrip,
} from "@/components/Sections";
import {
  BenefitsSection,
  HomeFaqSection,
  HomePricingSection,
  HomeTrustSection,
  PainSection,
  SystemSolutionSection,
} from "@/components/HomeExperienceSections";
import { HomeHero } from "@/components/HomeHero";

export default function Home() {
  return (
    <>
      <HomeHero />
      <ProofStrip />
      <PainSection />
      <SystemSolutionSection />
      <DirectionsSection />
      <BenefitsSection />
      <ApproachSection />
      <HomePricingSection />
      <HomeTrustSection />
      <CasesPreview />
      <ArticlesPreview />
      <HomeFaqSection />
      <LeadSection />
    </>
  );
}
