import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AEST_TZ = 'Australia/Sydney';

/** UTC ISO8601 → human-readable date in AEST (Australia/Sydney) timezone. */
export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-AU', { timeZone: AEST_TZ, year: 'numeric', month: 'short', day: 'numeric' });
}

/** UTC ISO8601 → datetime-local input format (YYYY-MM-DDTHH:mm) in AEST (Australia/Sydney) timezone. */
export function isoToLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: AEST_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  // Some engines emit '24' for midnight; normalise to '00'
  const hour = get('hour') === '24' ? '00' : get('hour');
  return `${get('year')}-${get('month')}-${get('day')}T${hour}:${get('minute')}`;
}

/**
 * datetime-local input value (YYYY-MM-DDTHH:mm, treated as AEST/Australia/Sydney) → UTC ISO8601.
 * Probes both AEST (+10:00) and AEDT (+11:00) and picks the one that round-trips correctly,
 * so DST transitions are handled without a timezone library.
 */
export function aestInputToIso(localStr: string): string {
  if (!localStr) return '';
  for (const offset of ['+11:00', '+10:00']) {
    const candidate = new Date(`${localStr}:00${offset}`);
    if (Number.isNaN(candidate.getTime())) continue;
    if (isoToLocalInput(candidate.toISOString()) === localStr) {
      return candidate.toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
  }
  // Fallback: standard AEST (+10:00)
  const d = new Date(`${localStr}:00+10:00`);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}
