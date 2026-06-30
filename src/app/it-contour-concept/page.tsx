import type { Metadata } from "next";
import { ImmersiveItConcept } from "@/components/ImmersiveItConcept";

export const metadata: Metadata = {
  title: "Immersive IT-контур Onixbit",
  description:
    "Экспериментальная страница Onixbit: интерактивный IT-контур бизнеса для CRM, сайта, 1С, коммуникаций и управленческого контроля.",
  alternates: {
    canonical: "/it-contour-concept",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Immersive IT-контур Onixbit",
    description:
      "Концепт отдельной immersive-страницы про управляемую связку сайта, Битрикс24, 1С и коммуникаций.",
    url: "/it-contour-concept",
    type: "website",
  },
};

export default function ItContourConceptPage() {
  return <ImmersiveItConcept />;
}
