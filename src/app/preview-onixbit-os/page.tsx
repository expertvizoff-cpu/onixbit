import type { Metadata } from "next";
import { OnixbitOsPreview } from "./OnixbitOsPreview";

export const metadata: Metadata = {
  title: "Концепт редизайна Onixbit OS",
  description:
    "Временный motion-прототип Onixbit: fullscreen pinned scrollytelling, где прокрутка двигает камеру, объекты, световые связи и бизнес-сцену сайта, CRM и 1С.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/preview-onixbit-os",
  },
};

export default function PreviewOnixbitOsPage() {
  return <OnixbitOsPreview />;
}
