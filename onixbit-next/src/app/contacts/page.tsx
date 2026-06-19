import type { Metadata } from "next";
import { ContactsContent } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты Onixbit для обсуждения проекта.",
};

export default function ContactsPage() {
  return <ContactsContent />;
}
