import type { Metadata } from "next";
import { ContactsContent } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Контакты Ониксбит: телефон, офисы, реквизиты и форма заявки",
  description:
    "Связаться с Ониксбит: телефон, email, мессенджеры, офисы в Туле и Кимовске, реквизиты ИП Тужилкин А.П. и форма заявки Битрикс24.",
};

export default function ContactsPage() {
  return <ContactsContent />;
}
