import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const pages = ["", "/features", "/platform", "/why", "/pricing", "/about", "/blog", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
