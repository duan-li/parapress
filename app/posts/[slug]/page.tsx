import { Markdown } from '@/components/markdown';
import { getPublishedPostBySlug, listPublishedSlugs } from '@/lib/posts';
import { SITE_NAME, siteUrl } from '@/lib/site';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 600;
// Published slugs are pre-rendered; new slugs are generated on first access (ISR).
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await listPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: 'Not found' };

  const url = `${siteUrl()}/posts/${post.slug}`;
  const description = post.excerpt ?? undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      siteName: SITE_NAME,
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
    },
    twitter: { card: 'summary_large_image', title: post.title, description },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    description: post.excerpt ?? undefined,
    mainEntityOfPage: `${siteUrl()}/posts/${post.slug}`,
  };

  return (
    <article className="py-10">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD; content is escaped below
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd).replace(/</g, '\\u003c'),
        }}
      />

      <nav className="mb-6 font-mono text-xs text-muted">
        <Link href="/" className="hover:text-text">
          ← Blog
        </Link>
      </nav>

      <header className="mb-8">
        <div className="font-mono text-[12px] text-dim">{formatDate(post.publishedAt)}</div>
        <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-tight">{post.title}</h1>
      </header>

      <Markdown>{post.body}</Markdown>
    </article>
  );
}
