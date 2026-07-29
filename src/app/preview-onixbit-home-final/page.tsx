import type { Metadata } from "next";
import { HomeFinalCinema } from "./HomeFinalCinema";

export const metadata: Metadata = {
  title: "Preview главной Onixbit: маршрут заявки",
  description:
    "Безопасный preview главной Onixbit по ТЗ: первый экран, маршрут заявки, диагностика и сценарии без публикации production route.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: "/preview-onixbit-home-final",
  },
};

export default function PreviewOnixbitHomeFinalPage() {
  return <HomeFinalCinema />;
}
