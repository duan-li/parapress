import 'server-only';

import { getDb, getDbOrNull } from './db';
import { slugify } from './slug';

export type PostStatus = 'draft' | 'published';

export interface Post {
  id: number;
  slug: string;
  title: string;
  body: string;
  excerpt: string | null;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const PAGE_SIZE = 10;

interface PostRow {
  id: number;
  slug: string;
  title: string;
  body: string;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(r: PostRow): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    body: r.body,
    excerpt: r.excerpt,
    status: r.status === 'published' ? 'published' : 'draft',
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// ---------------------------------------------------------------------------
// Public reads — returns only published posts whose publish time has passed (supports scheduled publishing)
// ---------------------------------------------------------------------------

export async function listPublishedPosts(page: number): Promise<{ posts: Post[]; total: number }> {
  const db = getDbOrNull();
  if (!db) return { posts: [], total: 0 };
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;
  const now = nowIso();

  const countRes = await db
    .prepare(
      "SELECT COUNT(*) AS n FROM posts WHERE status='published' AND published_at IS NOT NULL AND published_at <= ?1",
    )
    .bind(now)
    .first<{ n: number }>();

  const rows = await db
    .prepare(
      `SELECT * FROM posts
       WHERE status='published' AND published_at IS NOT NULL AND published_at <= ?1
       ORDER BY published_at DESC
       LIMIT ?2 OFFSET ?3`,
    )
    .bind(now, PAGE_SIZE, offset)
    .all<PostRow>();

  return {
    posts: (rows.results ?? []).map(mapRow),
    total: countRes?.n ?? 0,
  };
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const db = getDbOrNull();
  if (!db) return null;
  const now = nowIso();
  const row = await db
    .prepare(
      "SELECT * FROM posts WHERE slug=?1 AND status='published' AND published_at IS NOT NULL AND published_at <= ?2 LIMIT 1",
    )
    .bind(slug, now)
    .first<PostRow>();
  return row ? mapRow(row) : null;
}

/** Returns slug list of published posts, used by generateStaticParams. */
export async function listPublishedSlugs(limit = 1000): Promise<string[]> {
  const db = getDbOrNull();
  if (!db) return [];
  const now = nowIso();
  const rows = await db
    .prepare(
      "SELECT slug FROM posts WHERE status='published' AND published_at IS NOT NULL AND published_at <= ?1 ORDER BY published_at DESC LIMIT ?2",
    )
    .bind(now, limit)
    .all<{ slug: string }>();
  return (rows.results ?? []).map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// Admin reads — includes drafts and future-scheduled posts
// ---------------------------------------------------------------------------

export async function listAllPosts(): Promise<Post[]> {
  const db = getDb();
  const rows = await db
    .prepare('SELECT * FROM posts ORDER BY COALESCE(published_at, updated_at) DESC')
    .all<PostRow>();
  return (rows.results ?? []).map(mapRow);
}

export async function getPostById(id: number): Promise<Post | null> {
  const db = getDb();
  const row = await db.prepare('SELECT * FROM posts WHERE id=?1 LIMIT 1').bind(id).first<PostRow>();
  return row ? mapRow(row) : null;
}

// ---------------------------------------------------------------------------
// Writes (admin)
// ---------------------------------------------------------------------------

export interface PostInput {
  title: string;
  slug?: string;
  body: string;
  excerpt?: string | null;
  status: PostStatus;
  publishedAt?: string | null; // UTC ISO8601; defaults to now when status is published and no value is provided
}

/** Generates a unique slug in the DB (appends -2 / -3 … on collision). excludeId skips the post being edited. */
async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const db = getDb();
  const root = slugify(base) || 'post';
  let candidate = root;
  let n = 1;
  while (true) {
    const row = await db
      .prepare('SELECT id FROM posts WHERE slug=?1 AND (?2 IS NULL OR id<>?2) LIMIT 1')
      .bind(candidate, excludeId ?? null)
      .first<{ id: number }>();
    if (!row) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

function resolvePublishedAt(input: PostInput): string | null {
  if (input.status !== 'published') return input.publishedAt ?? null;
  // published: use the given time (scheduled publish), otherwise publish immediately (now)
  return input.publishedAt && input.publishedAt.trim() !== '' ? input.publishedAt : nowIso();
}

export async function createPost(input: PostInput): Promise<number> {
  const db = getDb();
  const slug = await uniqueSlug(input.slug?.trim() || input.title);
  const now = nowIso();
  const res = await db
    .prepare(
      `INSERT INTO posts (slug, title, body, excerpt, status, published_at, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7) RETURNING id`,
    )
    .bind(
      slug,
      input.title.trim(),
      input.body,
      input.excerpt?.trim() || null,
      input.status,
      resolvePublishedAt(input),
      now,
    )
    .first<{ id: number }>();
  return res?.id ?? 0;
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  const db = getDb();
  const slug = await uniqueSlug(input.slug?.trim() || input.title, id);
  await db
    .prepare(
      `UPDATE posts SET slug=?1, title=?2, body=?3, excerpt=?4, status=?5, published_at=?6,
       updated_at=?7 WHERE id=?8`,
    )
    .bind(
      slug,
      input.title.trim(),
      input.body,
      input.excerpt?.trim() || null,
      input.status,
      resolvePublishedAt(input),
      nowIso(),
      id,
    )
    .run();
}

export async function deletePost(id: number): Promise<void> {
  const db = getDb();
  await db.prepare('DELETE FROM posts WHERE id=?1').bind(id).run();
}
