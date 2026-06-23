import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions } from "@/data/site";

const direction = directions.find((item) => item.id === "onec")!;

export const metadata: Metadata = {
  title: "Работы по 1С:Предприятие",
  description:
    "Интеграции 1С:Предприятие с Битрикс24 и сайтами на 1С-Битрикс.",
};

export default function OnecPage() {
  return <ServicePage direction={direction} />;
}
