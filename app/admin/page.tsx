import { DeleteButton } from '@/components/admin/delete-button-client';
import { listAllPosts } from '@/lib/posts';
import { cn, formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { deletePostAction } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default async function AdminPage() {
  const posts = await listAllPosts();
  const now = new Date().toISOString();

  return (
    <div className="py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Posts</h1>
          <p className="mt-1 text-[13px] text-muted">{posts.length} total</p>
        </div>
        <Link
          href="/admin/new"
          className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-[#0b0d10] transition-colors hover:bg-accent-strong"
        >
          + New post
        </Link>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-5 py-10 text-center text-sm text-muted">
          No posts yet. Create your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full border-collapse text-[14px]">
            <tbody>
              {posts.map((post) => {
                const scheduled =
                  post.status === 'published' &&
                  post.publishedAt !== null &&
                  post.publishedAt > now;
                const badge = scheduled ? 'scheduled' : post.status;
                return (
                  <tr key={post.id} className="border-b border-border last:border-b-0 bg-surface">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/${post.id}/edit` as Route}
                        className="font-medium hover:text-accent"
                      >
                        {post.title}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-dim">
                        /{post.slug} · {formatDate(post.publishedAt) || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 font-mono text-[11px] capitalize',
                          badge === 'published' && 'border-up/40 text-up',
                          badge === 'draft' && 'border-border text-muted',
                          badge === 'scheduled' && 'border-accent/40 text-accent',
                        )}
                      >
                        {badge}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/${post.id}/edit` as Route}
                          className="rounded-md border border-border px-2.5 py-1 text-[12px] text-muted hover:border-border-strong hover:text-text"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deletePostAction.bind(null, post.id)}
                          title={post.title}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
