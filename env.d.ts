import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

// Cloudflare runtime bindings. Accessed via `getCloudflareContext().env` (see lib/db.ts).
// Regenerate with `pnpm cf:typegen` from wrangler.toml; hand-written here to keep the minimal required set.
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    NEXT_INC_CACHE_R2_BUCKET?: R2Bucket;
    ASSETS?: Fetcher;
    SITE_URL?: string;
    REVALIDATE_SECRET?: string;
  }
}

export {};
