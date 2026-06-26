import type { Metadata } from "next";
import { ContactsContent } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Контакты Ониксбит: телефон, email, адреса и реквизиты",
  description:
    "Контакты Ониксбит для заявок по Битрикс24, 1С-Битрикс, 1С и интеграциям: телефон, email, мессенджеры, адрес в Туле, почтовый адрес в Кимовске, реквизиты и форма заявки.",
  alternates: {
    canonical: "/contacts",
  },
  openGraph: {
    title: "Контакты Ониксбит",
    description:
      "Телефон, email, мессенджеры, адреса, реквизиты и форма заявки для проектов Битрикс24, 1С-Битрикс, 1С и интеграций.",
    url: "/contacts",
    type: "website",
  },
};

export default function ContactsPage() {
  return <ContactsContent />;
}
