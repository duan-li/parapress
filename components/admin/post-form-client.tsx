'use client';

import { Markdown } from '@/components/markdown';
import { slugify } from '@/lib/slug';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface PostFormInitial {
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  status: 'draft' | 'published';
  /** datetime-local format (YYYY-MM-DDTHH:mm), local timezone */
  publishedAtLocal: string;
}

const EMPTY: PostFormInitial = {
  title: '',
  slug: '',
  body: '',
  excerpt: '',
  status: 'draft',
  publishedAtLocal: '',
};

/**
 * Post edit form (shared by create and edit). `action` is a Server Action passed from the server.
 * The markdown body uses a textarea with live preview. Before submission, datetime-local is converted
 * to UTC ISO and written to a hidden field publishedAtIso (used directly on the server to avoid timezone ambiguity).
 */
export function PostForm({
  action,
  initial = EMPTY,
  submitLabel = 'Save',
}: {
  action: (form: FormData) => void | Promise<void>;
  initial?: PostFormInitial;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [body, setBody] = useState(initial.body);
  const [status, setStatus] = useState<'draft' | 'published'>(initial.status);
  const [publishedAtLocal, setPublishedAtLocal] = useState(initial.publishedAtLocal);
  const [showPreview, setShowPreview] = useState(false);

  const publishedAtIso =
    publishedAtLocal && !Number.isNaN(new Date(publishedAtLocal).getTime())
      ? new Date(publishedAtLocal).toISOString()
      : '';

  const inputCls =
    'w-full rounded-md border border-border bg-bg px-3 py-2 text-[14px] text-text outline-none focus:border-border-strong';
  const labelCls = 'mb-1.5 block text-[12px] font-medium text-muted';

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className={labelCls} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            // auto-derive slug from title when blank; stop overriding once the user has edited the slug
            if (slug === '' || slug === slugify(title)) setSlug(slugify(e.target.value));
          }}
          className={inputCls}
          placeholder="Post title"
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="slug">
          Slug <span className="text-dim">(leave blank to auto-generate)</span>
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={`${inputCls} font-mono`}
          placeholder="my-first-post"
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="excerpt">
          Excerpt <span className="text-dim">(list/RSS summary, optional)</span>
        </label>
        <input id="excerpt" name="excerpt" defaultValue={initial.excerpt} className={inputCls} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className={labelCls.replace('mb-1.5 block', 'block')}>Body (Markdown)</span>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="font-mono text-[12px] text-accent hover:underline"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-[320px] rounded-md border border-border bg-bg px-4 py-3">
            {body.trim() ? (
              <Markdown>{body}</Markdown>
            ) : (
              <span className="text-sm text-dim">Nothing to preview.</span>
            )}
          </div>
        ) : (
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={18}
            className={`${inputCls} resize-y font-mono leading-relaxed`}
            placeholder="# Hello&#10;&#10;Write your post in **markdown**…"
          />
        )}
        {/* textarea is absent from the DOM in preview mode; hidden field ensures body is always submitted */}
        {showPreview && <input type="hidden" name="body" value={body} />}
      </div>

      <div className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2">
        <div>
          <span className={labelCls.replace('mb-1.5 block', 'block')}>Status</span>
          <div className="flex gap-2">
            {(['draft', 'published'] as const).map((s) => (
              <label
                key={s}
                className={cn(
                  'flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-[13px] capitalize transition-colors',
                  status === s
                    ? 'border-accent bg-accent-soft text-text'
                    : 'border-border text-muted hover:border-border-strong',
                )}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="publishedAtLocal">
            Publish at <span className="text-dim">(optional future time = scheduled publish)</span>
          </label>
          <input
            id="publishedAtLocal"
            type="datetime-local"
            value={publishedAtLocal}
            onChange={(e) => setPublishedAtLocal(e.target.value)}
            className={`${inputCls} font-mono`}
          />
          <input type="hidden" name="publishedAtIso" value={publishedAtIso} />
          <p className="mt-1 text-[11px] text-dim">
            {status === 'published' && publishedAtIso === ''
              ? 'Leave blank = publish immediately'
              : publishedAtIso
                ? `UTC: ${publishedAtIso}`
                : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-[#0b0d10] transition-colors hover:bg-accent-strong"
        >
          {submitLabel}
        </button>
        <a
          href="/admin"
          className="rounded-md border border-border px-4 py-2 text-[13px] text-muted hover:border-border-strong hover:text-text"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
