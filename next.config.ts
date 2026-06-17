import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // No remote domains needed; the blog uses local assets only.
  images: { formats: ['image/avif', 'image/webp'] },
};

export default config;

// OpenNext Cloudflare adapter: makes D1/R2 bindings available during local `next dev`.
// Only initialised in development; in production the OpenNext worker injects bindings.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();
