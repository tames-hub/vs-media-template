import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur"
      style={{ borderColor: siteConfig.themeColor }}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold" style={{ color: siteConfig.themeColor }}>
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            홈
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
