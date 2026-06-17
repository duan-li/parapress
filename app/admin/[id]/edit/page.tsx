import { PostForm } from '@/components/admin/post-form-client';
import { getPostById } from '@/lib/posts';
import { isoToLocalInput } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updatePostAction } from '../../actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Edit post', robots: { index: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) notFound();

  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="py-10">
      <nav className="mb-6 font-mono text-xs text-muted">
        <Link href="/admin" className="hover:text-text">
          ← Posts
        </Link>
      </nav>
      <h1 className="mb-6 text-[24px] font-bold tracking-tight">Edit post</h1>
      <PostForm
        action={updatePostAction.bind(null, id)}
        submitLabel="Save changes"
        initial={{
          title: post.title,
          slug: post.slug,
          body: post.body,
          excerpt: post.excerpt ?? '',
          status: post.status,
          publishedAtLocal: isoToLocalInput(post.publishedAt),
        }}
      />
    </div>
  );
}
