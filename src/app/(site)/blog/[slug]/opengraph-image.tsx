import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/components/og/og-card";
import { getPost, getPosts } from "@/lib/content";
import { formatDate, readingTime } from "@/lib/utils";

export const alt = "Case LMS, legal practice management insights";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateImageMetadata() {
  const posts = await getPosts();
  return posts.length
    ? posts.map((p) => ({ id: p.slug, alt: p.title, size, contentType }))
    : [{ id: "default", alt, size, contentType }];
}

export default async function PostOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return new ImageResponse(
      <OgCard eyebrow="Insight" title="Article not found" />,
      size,
    );
  }
  const meta = [post.author, formatDate(post.publishedAt), `${readingTime(post.content)} min read`]
    .filter(Boolean)
    .join("  ·  ");
  return new ImageResponse(
    (
      <OgCard
        eyebrow={post.tags?.[0] ?? "Insight"}
        title={post.title}
        subhead={post.excerpt}
        meta={meta}
      />
    ),
    size,
  );
}
