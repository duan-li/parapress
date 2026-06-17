/**
 * ISR revalidation period (seconds) for public pages. Scheduled posts go live automatically within this window without needing a cron.
 *
 * Note: data comes from D1 (not fetch), so Next's fetch-tag cache is not used.
 * On-demand revalidation therefore uses revalidatePath('/', 'layout') (invalidates all routes under the root layout)
 * rather than revalidateTag.
 */
export const REVALIDATE_SECONDS = 600;
