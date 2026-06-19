import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { LeadPopupBridge } from "@/components/BitrixForms";
import { JsonLd } from "@/components/JsonLd";
import { YandexMetrika } from "@/components/YandexMetrika";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/media/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/media/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/media/icons/apple-touch-icon.png", sizes: "180x180" }],
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
        <ScrollTopButton />
        <PrivacyConsent />
        <MobileDock />
        <LeadPopupBridge />
        <YandexMetrika counterId={yandexMetrikaCounterId} />
      </body>
    </html>
  );
}
