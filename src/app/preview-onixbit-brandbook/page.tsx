import type { Metadata } from "next";
import { BrandbookPreview } from "./BrandbookPreview";

export const metadata: Metadata = {
  title: "Брендбук Onixbit",
  description: "Рабочая красивая страница брендбука Onixbit: позиционирование, цвета, типографика, сетка, компоненты и голос.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/preview-onixbit-brandbook",
  },
};

export default function PreviewOnixbitBrandbookPage() {
  return <BrandbookPreview />;
}
