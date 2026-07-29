import type { Metadata } from "next";
import { PreviewSite } from "./PreviewSite";

export const metadata: Metadata = {
  title: "Демо редизайна Ониксбит",
  description:
    "Временный демо-сайт редизайна Ониксбит: тёмная системная визуальная концепция, услуги, сертификаты, о компании, контакты и privacy.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewOnixbitSitePage() {
  return <PreviewSite pageKey="home" />;
}
