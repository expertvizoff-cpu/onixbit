import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ониксбит: Битрикс24, 1С-Битрикс, 1С и интеграции для B2B",
  description:
    "Ониксбит внедряет Битрикс24, разрабатывает сайты на 1С-Битрикс и связывает CRM, сайт, 1С и коммуникации в управляемую систему для B2B-компаний.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ониксбит: CRM, сайт и 1С как одна система",
    description:
      "Битрикс24, 1С-Битрикс, 1С:Предприятие, интеграции, лицензии и поддержка для B2B-команд.",
    url: "/",
    type: "website",
  },
};

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
