import type { MetadataRoute } from "next";
import { directions, mainNav } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://onixbit.ru";
  const serviceRoutes = new Set(directions.map((item) => item.href));
  const routes = [
    "/",
    ...directions.map((item) => item.href),
    ...mainNav.map((item) => item.href),
    "/contacts",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: baseUrl + route,
    lastModified: new Date("2026-06-28"),
    changeFrequency: route === "/" || serviceRoutes.has(route) ? "weekly" : "monthly",
    priority: route === "/" ? 1 : serviceRoutes.has(route) ? 0.9 : route === "/contacts" ? 0.8 : route === "/privacy" ? 0.35 : 0.72,
  }));
}
