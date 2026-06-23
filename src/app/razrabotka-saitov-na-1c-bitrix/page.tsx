import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions } from "@/data/site";

const direction = directions.find((item) => item.id === "sites")!;

export const metadata: Metadata = {
  title: "Разработка сайтов на 1С-Битрикс",
  description:
    "Корпоративные сайты, каталоги и интернет-магазины на 1С-Битрикс с интеграциями.",
};

export default function SitesPage() {
  return <ServicePage direction={direction} />;
}
