import { Footer } from '@/components/layout/footer';
import { TopNav } from '@/components/layout/top-nav';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — The ParaPulse Blog`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <TopNav />
        <main className="mx-auto min-h-[calc(100vh-56px-160px)] max-w-[820px] px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
