import type { Metadata } from "next";
import { Bitrix24Prototype } from "@/components/Bitrix24Prototype";

export const metadata: Metadata = {
  title: "Preview: внедрение Битрикс24",
  description: "Согласовательный прототип страницы внедрения Битрикс24 для Ониксбит.",
  robots: { index: false, follow: false },
};

export default function Bitrix24PrototypePage() {
  return <Bitrix24Prototype />;
}
