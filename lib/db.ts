import 'server-only';

import type { D1Database } from '@cloudflare/workers-types';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Returns the D1 binding. Server-only (RSC / Route Handler / Server Action).
 * OpenNext injects wrangler.toml bindings via getCloudflareContext().
 *
 * Use for admin (write) paths: throws if the binding is missing, which should never happen at request time.
 */
export function getDb(): D1Database {
  const db = getDbOrNull();
  if (!db) {
    throw new Error('D1 binding "DB" is not available (no Cloudflare context).');
  }
  return db;
}

/**
 * Returns the D1 binding, or null if unavailable.
 *
 * Use for public (ISR) pages: during `next build` in CI there is no D1 binding,
 * so this returns null and pages render empty; when ISR regenerates at runtime the binding is present and real data is used.
 * This ensures builds never fail due to a missing binding.
 */
export function getDbOrNull(): D1Database | null {
  try {
    const { env } = getCloudflareContext();
    return env.DB ?? null;
  } catch {
    return null;
  }
}
