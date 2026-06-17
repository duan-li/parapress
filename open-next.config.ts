import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';

// ISR incremental cache is stored in R2 (persisted across edge nodes). Binding name NEXT_INC_CACHE_R2_BUCKET
// is configured in wrangler.toml. Without this binding, ISR degrades to per-request rebuilds (still works, but no cache benefit).
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
