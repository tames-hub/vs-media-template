import Link from 'next/link';
import { siteConfig } from '@/lib/config';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  function getPageUrl(page: number): string {
    if (page === 1) return basePath || '/';
    return `${basePath}?page=${page}`;
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="페이지네이션">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          이전
        </Link>
      )}

      {pages.map((page, idx) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              page === currentPage
                ? 'font-semibold text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={page === currentPage ? { backgroundColor: siteConfig.themeColor } : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          다음
        </Link>
      )}
    </nav>
  );
}
