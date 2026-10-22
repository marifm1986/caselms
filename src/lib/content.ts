import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { defaultSettings, fallbackContent } from "./defaults";
import { FirestoreUnavailableError, getDocument, queryCollection } from "./firestore-rest";
import type { Faq, Feature, Plan, Post, SiteSettings, Stat, TeamMember, Testimonial } from "./types";

// Cached content getters for public pages. Admin writes call updateTag() with
// the same tag names (see src/app/actions/revalidate.ts).
export const CONTENT_TAGS = ["settings", "features", "plans", "testimonials", "faqs", "stats", "team", "posts"] as const;
export type ContentTag = (typeof CONTENT_TAGS)[number];

const byOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

async function withFallback<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    // Never take the public site down because the CMS is unreachable.
    const reason = error instanceof FirestoreUnavailableError ? error.message : String(error);
    console.warn(`[content] ${reason}; using fallback content`);
    return fallback;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("settings");
  cacheLife("hours");
  return withFallback(async () => {
    const doc = await getDocument<Partial<SiteSettings>>("settings/site");
    return {
      ...defaultSettings,
      ...doc,
      socials: { ...defaultSettings.socials, ...doc?.socials },
    };
  }, defaultSettings);
}

export async function getFeatures(): Promise<Feature[]> {
  "use cache";
  cacheTag("features");
  cacheLife("hours");
  return withFallback(async () => byOrder(await queryCollection<Feature>("features")), fallbackContent.features);
}

export async function getPlans(): Promise<Plan[]> {
  "use cache";
  cacheTag("plans");
  cacheLife("hours");
  return withFallback(async () => byOrder(await queryCollection<Plan>("plans")), fallbackContent.plans);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag("testimonials");
  cacheLife("hours");
  return withFallback(
    async () => byOrder(await queryCollection<Testimonial>("testimonials")),
    fallbackContent.testimonials,
  );
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag("faqs");
  cacheLife("hours");
  return withFallback(async () => byOrder(await queryCollection<Faq>("faqs")), fallbackContent.faqs);
}

export async function getStats(): Promise<Stat[]> {
  "use cache";
  cacheTag("stats");
  cacheLife("hours");
  return withFallback(
    async () => byOrder(await queryCollection<Stat>("stats", { publishedOnly: false })),
    fallbackContent.stats,
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  "use cache";
  cacheTag("team");
  cacheLife("hours");
  return withFallback(async () => byOrder(await queryCollection<TeamMember>("team")), fallbackContent.team);
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  const posts = await withFallback(() => queryCollection<Post>("posts"), fallbackContent.posts);
  return [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
