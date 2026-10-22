import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/json-ld";
import { CloudImage } from "@/components/ui/cloud-image";
import { getPost, getPosts, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { formatDate, readingTime } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getPosts();
  // Cache Components needs at least one param; an unknown slug simply 404s.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "coming-soon" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

/** Renders the admin's plain-text format: blank-line paragraphs and "## " headings. */
function PostBody({ content }: { content: string }) {
  return (
    <div className="prose-post">
      {content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, i) =>
          block.startsWith("## ") ? <h2 key={i}>{block.slice(3)}</h2> : <p key={i}>{block}</p>,
        )}
    </div>
  );
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) notFound();

  return (
    <article className="pb-24">
      <header className="relative overflow-hidden bg-ink-900 text-slate-300">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="container-page relative max-w-3xl py-16 sm:py-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-brass-300 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden="true" /> All insights
          </Link>
          <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{post.title}</h1>
          <p className="mt-6 text-sm">
            By {post.author} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> ·{" "}
            {readingTime(post.content)} min read
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      <div className="container-page max-w-3xl pt-12">
        {post.coverImage && (
          <CloudImage
            src={post.coverImage}
            alt=""
            width={1200}
            height={630}
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="mb-12 aspect-[1200/630] w-full rounded-3xl object-cover"
          />
        )}
        <p className="mb-8 text-xl leading-8 text-ink-900">{post.excerpt}</p>
        <PostBody content={post.content} />
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: settings.siteName, url: siteUrl },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
          ...(post.coverImage ? { image: post.coverImage } : {}),
          keywords: post.tags.join(", "),
        }}
      />
    </article>
  );
}
