import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions } from "@/data/site";

const direction = directions.find((item) => item.id === "onec")!;

export const metadata: Metadata = {
  title: "Интеграции 1С с Битрикс24 и сайтами на 1С-Битрикс",
  description:
    "Ониксбит помогает связать 1С:Предприятие с Битрикс24 и сайтами на 1С-Битрикс: заказы, остатки, цены, статусы, обмены и контроль ошибок.",
  alternates: {
    canonical: "/raboty-po-1c-predpriyatie",
  },
  openGraph: {
    title: "Интеграции 1С | Ониксбит",
    description:
      "Обмены 1С, CRM и сайта: заказы, остатки, цены, статусы и управляемая поддержка.",
    url: "/raboty-po-1c-predpriyatie",
    type: "website",
  },
};

export default function OnecPage() {
  return <ServicePage direction={direction} />;
}
