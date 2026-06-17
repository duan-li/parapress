// parapress-cron: periodically revalidates the main site so scheduled posts go live on time.
// Acts as a fallback alongside the main site's `export const revalidate = 600` — either one is sufficient.

interface Env {
  REVALIDATE_URL: string;
  REVALIDATE_SECRET: string;
}

export default {
  async scheduled(_event: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
    if (!env.REVALIDATE_SECRET) {
      console.error('parapress-cron: REVALIDATE_SECRET not set');
      return;
    }
    const url = `${env.REVALIDATE_URL}?secret=${encodeURIComponent(env.REVALIDATE_SECRET)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      console.error(`parapress-cron: revalidate failed ${res.status}`);
    }
  },

  // Allows a one-off manual trigger via curl (GET /).
  async fetch(_req: Request, env: Env): Promise<Response> {
    const url = `${env.REVALIDATE_URL}?secret=${encodeURIComponent(env.REVALIDATE_SECRET)}`;
    const res = await fetch(url);
    return new Response(`revalidate → ${res.status}`, { status: res.ok ? 200 : 502 });
  },
};
