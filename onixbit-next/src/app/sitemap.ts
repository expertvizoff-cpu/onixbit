import type { MetadataRoute } from "next";
import { directions, mainNav } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://onixbit.ru";
  const routes = [
    "/",
    ...directions.map((item) => item.href),
    ...mainNav.map((item) => item.href),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-06-19"),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.75,
  }));
}
