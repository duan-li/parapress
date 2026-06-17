import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface pb-8 pt-10">
      <div className="mx-auto flex max-w-[820px] flex-col justify-between gap-2 px-6 font-mono text-xs text-dim min-[768px]:flex-row">
        <span>© {new Date().getFullYear()} ParaPress · The ParaPulse blog</span>
        <div className="flex gap-4">
          <Link href="/feed.xml" className="hover:text-text">
            RSS
          </Link>
          <a
            href="https://parapulse.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text"
          >
            ParaPulse ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
