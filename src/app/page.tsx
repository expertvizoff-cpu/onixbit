import {
  ApproachSection,
  ArticlesPreview,
  CasesPreview,
  CertificatesGrid,
  DirectionsSection,
  LeadSection,
  LicenseGrid,
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
      <LicenseGrid />
      <CertificatesGrid />
      <ApproachSection />
      <CasesPreview />
      <TestimonialsSection />
      <ArticlesPreview />
      <LeadSection />
    </>
  );
}
