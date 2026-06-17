'use client';

import { cn } from '@/lib/utils';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string };

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 min-[768px]:flex">
      {items.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              'rounded-md px-3 py-[7px] text-[13px] font-medium text-muted transition-colors',
              isActive && 'bg-surface-2 text-text',
              !isActive && 'hover:bg-surface-2 hover:text-text',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
