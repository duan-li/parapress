import 'server-only';

import { getCloudflareContext } from '@opennextjs/cloudflare';

/** Site URL (used for RSS / canonical links). Prefers the CF var; falls back to the default. */
export function siteUrl(): string {
  try {
    const { env } = getCloudflareContext();
    if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, '');
  } catch {
    // not running in a Cloudflare context (local dev)
  }
  return (process.env.SITE_URL ?? 'https://parapress.parapulse.io').replace(/\/$/, '');
}

export const SITE_NAME = 'ParaPress';
export const SITE_DESCRIPTION = 'The ParaPulse blog — notes on the HuggingFace ecosystem.';
