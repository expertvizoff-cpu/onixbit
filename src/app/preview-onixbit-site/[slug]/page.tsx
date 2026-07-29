import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewSite } from "../PreviewSite";
import { getPreviewPage, previewSlugs, type PreviewPageKey } from "../data";

export const dynamicParams = false;

export function generateStaticParams() {
  return previewSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/preview-onixbit-site/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getPreviewPage(slug);

  if (!page) {
    return {
      title: "Демо редизайна Ониксбит",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${page.title} — демо Ониксбит`,
    description: page.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PreviewOnixbitSiteSlugPage(props: PageProps<"/preview-onixbit-site/[slug]">) {
  const { slug } = await props.params;
  const page = getPreviewPage(slug);

  if (!page) notFound();

  return <PreviewSite pageKey={slug as PreviewPageKey} />;
}
