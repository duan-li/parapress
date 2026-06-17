import { PAGE_SIZE, listPublishedPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import type { Route } from 'next';
import Link from 'next/link';

// Scheduled posts go live automatically within this window (10 min) without a cron. Must be a literal.
export const revalidate = 600;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);

  const { posts, total } = await listPublishedPosts(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="py-10">
      <header className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight">Blog</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Notes, updates, and deep dives from the ParaPulse team.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-5 py-10 text-center text-sm text-muted">
          No posts yet. Check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}` as Route}
              className="group rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong hover:bg-surface-2"
            >
              <div className="font-mono text-[11px] text-dim">{formatDate(post.publishedAt)}</div>
              <h2 className="mt-1 text-[17px] font-semibold leading-snug group-hover:text-accent">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between font-mono text-[13px]">
          {page > 1 ? (
            <Link
              href={(page - 1 === 1 ? '/' : `/?page=${page - 1}`) as Route}
              className="rounded-md border border-border px-3 py-1.5 text-muted hover:border-border-strong hover:text-text"
            >
              ← Newer
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-dim">← Newer</span>
          )}

          <span className="text-muted">
            {page} / {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`/?page=${page + 1}` as Route}
              className="rounded-md border border-border px-3 py-1.5 text-muted hover:border-border-strong hover:text-text"
            >
              Older →
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-dim">Older →</span>
          )}
        </nav>
      )}
    </div>
  );
}
