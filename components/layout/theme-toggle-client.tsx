'use client';

import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const Icon = theme === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-text"
      aria-label="Toggle theme"
    >
      <Icon size={16} />
    </button>
  );
}
