import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/sections";
import { CloudImage } from "@/components/ui/cloud-image";
import { getPosts } from "@/lib/content";
import { formatDate, readingTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insights",
  description: "Guides and insights on legal practice management, automation, compliance and running a modern law firm.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas for running a better law firm"
        intro="Practical guidance on technology, workflow and compliance from the Case LMS team."
      />
      <section aria-label="Articles" className="section">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-center text-slate-600">New articles are on the way. Check back soon.</p>
          ) : (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal as="li" key={post.id} delay={(i % 3) * 0.08}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-shadow hover:shadow-xl">
                    {post.coverImage ? (
                      <CloudImage
                        src={post.coverImage}
                        alt=""
                        width={640}
                        height={360}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="bg-grid aspect-video w-full bg-ink-900" aria-hidden="true" />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs text-slate-600">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> ·{" "}
                        {readingTime(post.content)} min read
                      </p>
                      <h2 className="mt-3 text-xl font-semibold">
                        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                      <span
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
                        aria-hidden="true"
                      >
                        Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
