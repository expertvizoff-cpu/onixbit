import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { LeadPopupBridge } from "@/components/BitrixForms";
import { JsonLd } from "@/components/JsonLd";
import { YandexMetrika } from "@/components/YandexMetrika";
import "./globals.css";

const yandexMetrikaCounterId =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "88710867";

export const metadata: Metadata = {
  metadataBase: new URL("https://onixbit.ru"),
  title: {
    default: "Ониксбит — Битрикс24, 1С-Битрикс и интеграции для B2B",
    template: "%s | Ониксбит",
  },
  description:
    "Ониксбит внедряет Битрикс24, разрабатывает сайты на 1С-Битрикс и помогает связать CRM, сайт и 1С:Предприятие.",
  icons: {
    icon: [{ url: "/media/icons/favicon.png", type: "image/png" }],
    shortcut: "/media/icons/favicon.png",
    apple: "/media/icons/favicon.png",
  },
  openGraph: {
    title: "Ониксбит — разработка и интеграции для B2B",
    description:
      "Битрикс24, 1С-Битрикс, 1С:Предприятие, интеграции и автоматизация бизнес-процессов.",
    images: ["/brand/onixbit-og.png"],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileDock />
        <LeadPopupBridge />
        <YandexMetrika counterId={yandexMetrikaCounterId} />
      </body>
    </html>
  );
}
