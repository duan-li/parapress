import { PostForm } from '@/components/admin/post-form-client';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createPostAction } from '../actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New post', robots: { index: false } };

export default function NewPostPage() {
  return (
    <div className="py-10">
      <nav className="mb-6 font-mono text-xs text-muted">
        <Link href="/admin" className="hover:text-text">
          ← Posts
        </Link>
      </nav>
      <h1 className="mb-6 text-[24px] font-bold tracking-tight">New post</h1>
      <PostForm action={createPostAction} submitLabel="Create" />
    </div>
  );
}
