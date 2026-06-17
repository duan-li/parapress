import { getCloudflareContext } from '@opennextjs/cloudflare';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidate endpoint. Called by the cron worker (every ~10 min) with a secret
 * to immediately publish any scheduled posts that are due. Can also be triggered manually.
 *
 * GET /api/revalidate?secret=<REVALIDATE_SECRET>
 *
 * The secret comes from a Cloudflare secret (wrangler secret put REVALIDATE_SECRET).
 * This endpoint must be excluded from Cloudflare Access, otherwise the cron worker cannot reach it.
 */
export async function GET(req: Request) {
  let expected: string | undefined;
  try {
    expected = getCloudflareContext().env.REVALIDATE_SECRET;
  } catch {
    expected = process.env.REVALIDATE_SECRET;
  }

  if (!expected) {
    return Response.json({ error: 'server misconfigured' }, { status: 500 });
  }

  const provided = new URL(req.url).searchParams.get('secret');
  if (!provided || provided !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Invalidates all page routes under the root layout (list + all post detail pages).
  revalidatePath('/', 'layout');
  // Route handlers are not covered by layout-scoped revalidation; invalidate explicitly.
  revalidatePath('/feed.xml');

  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
