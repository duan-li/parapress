import { listPublishedPosts, listPublishedSlugs } from '@/lib/posts';
import { siteUrl } from '@/lib/site';
import type { MetadataRoute } from 'next';

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await listPublishedSlugs();
  const { posts } = await listPublishedPosts(1);
  const lastListed = posts[0]?.publishedAt;

  return [
    {
      url: base,
      changeFrequency: 'daily',
      priority: 1,
      ...(lastListed ? { lastModified: lastListed } : {}),
    },
    ...slugs.map((slug) => ({
      url: `${base}/posts/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
