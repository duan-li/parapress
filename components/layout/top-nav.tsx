import Link from 'next/link';
import { NavLinks } from './nav-links-client';
import { ThemeToggle } from './theme-toggle-client';

const NAV_ITEMS = [
  { href: '/', label: 'Blog' },
  { href: '/feed.xml', label: 'RSS' },
] as const;

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[rgba(11,13,16,0.85)] backdrop-blur-[12px] [html[data-theme=light]_&]:bg-[rgba(250,250,248,0.85)]">
      <div className="mx-auto flex h-14 max-w-[820px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-[18px] font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-[7px] bg-accent font-mono text-[15px] text-[#0b0d10]">
            P
          </span>
          <span>
            Para<span className="text-accent">Press</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLinks items={NAV_ITEMS.map((n) => ({ href: n.href, label: n.label }))} />
          <a
            href="https://parapulse.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md px-3 py-[7px] text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text min-[768px]:block"
          >
            ParaPulse ↗
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
