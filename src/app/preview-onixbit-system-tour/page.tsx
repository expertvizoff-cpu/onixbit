import type { Metadata } from "next";
import { SystemTourPreview } from "./SystemTourPreview";

export const metadata: Metadata = {
  title: "Интерактивный маршрут заявки Onixbit",
  description:
    "Прототип фирменной scroll-сцены Onixbit: заявка с сайта попадает в CRM, запускает менеджера, робота и обмен с 1С.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/preview-onixbit-system-tour",
  },
};

export default function PreviewOnixbitSystemTourPage() {
  return <SystemTourPreview />;
}
