'use server';

import { type PostInput, type PostStatus, createPost, deletePost, updatePost } from '@/lib/posts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function parseForm(form: FormData): PostInput {
  const status: PostStatus = form.get('status') === 'published' ? 'published' : 'draft';
  // The client converts datetime-local to UTC ISO and stores it in publishedAtIso (see post-form-client).
  const publishedAtIso = String(form.get('publishedAtIso') ?? '').trim();

  return {
    title: String(form.get('title') ?? '').trim(),
    slug: String(form.get('slug') ?? '').trim() || undefined,
    body: String(form.get('body') ?? ''),
    excerpt: String(form.get('excerpt') ?? '').trim() || null,
    status,
    publishedAt: publishedAtIso !== '' ? publishedAtIso : null,
  };
}

function refresh() {
  // Invalidates all routes under the root layout (list + all post detail pages + admin).
  revalidatePath('/', 'layout');
}

export async function createPostAction(form: FormData): Promise<void> {
  const input = parseForm(form);
  if (input.title === '') throw new Error('Title is required');
  await createPost(input);
  refresh();
  redirect('/admin');
}

export async function updatePostAction(id: number, form: FormData): Promise<void> {
  const input = parseForm(form);
  if (input.title === '') throw new Error('Title is required');
  await updatePost(id, input);
  refresh();
  redirect('/admin');
}

export async function deletePostAction(id: number): Promise<void> {
  await deletePost(id);
  refresh();
  redirect('/admin');
}
