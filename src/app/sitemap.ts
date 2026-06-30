import type { MetadataRoute } from "next";
import { knowledgeBaseArticles } from "@/data/articles";
import { directions, mainNav } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://onixbit.ru";
  const serviceRoutes = new Set(directions.map((item) => item.href));
  const routes = Array.from(new Set([
    "/",
    ...directions.map((item) => item.href),
    ...mainNav.map((item) => item.href),
    "/contacts",
    "/privacy",
  ]));

  return [
    ...routes.map((route) => ({
      url: baseUrl + route,
      lastModified: route === "/articles" ? new Date("2026-06-30") : new Date("2026-06-28"),
      changeFrequency: route === "/" || serviceRoutes.has(route) ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : serviceRoutes.has(route) ? 0.9 : route === "/contacts" ? 0.8 : route === "/privacy" ? 0.35 : 0.72,
    })),
    ...knowledgeBaseArticles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.lastUpdated),
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
  ];
}
