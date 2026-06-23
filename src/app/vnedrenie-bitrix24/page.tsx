import type { Metadata } from "next";
import { ServicePage } from "@/components/Sections";
import { directions } from "@/data/site";

const direction = directions.find((item) => item.id === "bitrix24")!;

export const metadata: Metadata = {
  title: "Внедрение Битрикс24",
  description:
    "Внедрение, настройка, автоматизация и разработка приложений для Битрикс24.",
};

export default function Bitrix24Page() {
  return <ServicePage direction={direction} />;
}
