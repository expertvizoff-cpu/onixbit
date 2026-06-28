import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions } from "@/data/site";

const direction = directions.find((item) => item.id === "sites")!;

export const metadata: Metadata = {
  title: "Разработка сайтов на 1С-Битрикс с CRM и 1С-интеграциями",
  description:
    "Ониксбит проектирует корпоративные сайты, каталоги и интернет-магазины на 1С-Битрикс: структура, формы, SEO-основа, CRM, 1С и поддержка развития.",
  alternates: {
    canonical: "/razrabotka-saitov-na-1c-bitrix",
  },
  openGraph: {
    title: "Сайты на 1С-Битрикс | Ониксбит",
    description:
      "Корпоративные сайты, каталоги, e-commerce и интеграции с Битрикс24 и 1С.",
    url: "/razrabotka-saitov-na-1c-bitrix",
    type: "website",
  },
};

export default function SitesPage() {
  return <ServicePage direction={direction} />;
}
