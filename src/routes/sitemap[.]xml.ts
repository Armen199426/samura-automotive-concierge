import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://samura-auto.ru";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const entries: SitemapEntry[] = [
          { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
          { path: "/auto-iz-yaponii", lastmod: today, changefreq: "monthly", priority: "0.8" },
          { path: "/auto-iz-korei", lastmod: today, changefreq: "monthly", priority: "0.8" },
          { path: "/auto-iz-kitaya", lastmod: today, changefreq: "monthly", priority: "0.8" },
          { path: "/auto-iz-evropy", lastmod: today, changefreq: "monthly", priority: "0.8" },
          { path: "/auto-iz-ssha", lastmod: today, changefreq: "monthly", priority: "0.8" },
          { path: "/uslugi/podbor-avto", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/dostavka-i-rastamozhka", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/avto-pod-zakaz", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/avto-iz-za-rubezha", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/parallelnyy-import-avto", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/proverka-avto", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/rastamozhka-avto", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/uslugi/pokupka-avto-na-auktsione-yaponii", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/region/moskva", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/region/sankt-peterburg", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/region/novosibirsk", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/region/krasnoyarsk", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/region/irkutsk", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/region/vladivostok", lastmod: today, changefreq: "monthly", priority: "0.7" },
          { path: "/privacy", lastmod: today, changefreq: "yearly", priority: "0.3" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
