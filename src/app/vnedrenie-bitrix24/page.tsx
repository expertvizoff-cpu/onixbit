import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions } from "@/data/site";

const direction = directions.find((item) => item.id === "bitrix24")!;

export const metadata: Metadata = {
  title: "Внедрение Битрикс24 под продажи, процессы и интеграции",
  description:
    "Ониксбит внедряет Битрикс24: CRM, воронки, роботы, права, отчёты, коммуникации, интеграции с сайтом, 1С и поддержка запуска.",
  alternates: {
    canonical: "/vnedrenie-bitrix24",
  },
  openGraph: {
    title: "Внедрение Битрикс24 | Ониксбит",
    description:
      "CRM, автоматизация продаж, коммуникации, отчёты и интеграции Битрикс24 для B2B-команд.",
    url: "/vnedrenie-bitrix24",
    type: "website",
  },
};

export default function Bitrix24Page() {
  return <ServicePage direction={direction} />;
}
