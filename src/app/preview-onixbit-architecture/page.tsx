import type { Metadata } from "next";
import { ArchitecturePreview } from "./ArchitecturePreview";

export const metadata: Metadata = {
  title: "Карта сайта Onixbit",
  description:
    "Рабочий прототип структуры будущего сайта Onixbit: страницы, блоки, стиль, навигация и процессные демо.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/preview-onixbit-architecture",
  },
};

export default function PreviewOnixbitArchitecturePage() {
  return <ArchitecturePreview />;
}
