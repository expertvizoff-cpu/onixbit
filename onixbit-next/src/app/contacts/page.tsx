import type { Metadata } from "next";
import { ContactsContent } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Контакты Onixbit: телефон, офисы, реквизиты и форма заявки",
  description:
    "Связаться с Onixbit: телефон, email, мессенджеры, офисы в Туле и Кимовске, реквизиты ИП Тужилкин А.П. и форма заявки Битрикс24.",
};

export default function ContactsPage() {
  return <ContactsContent />;
}
