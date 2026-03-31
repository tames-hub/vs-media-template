import Link from 'next/link';
import { siteConfig, crossMediaLinks } from '@/lib/config';

export default function Footer() {
  const otherMedia = crossMediaLinks.filter((m) => m.domain !== siteConfig.domain);

  return (
    <footer className="border-t bg-gray-50 mt-16">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">미디어 네트워크</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {otherMedia.map((media) => (
              <a
                key={media.domain}
                href={`https://${media.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {media.name}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 border-t pt-6 text-xs text-gray-400 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <Link href="/" className="hover:text-gray-600">
              {siteConfig.name}
            </Link>
            . All rights reserved.
          </p>
          <p>
            Powered by{' '}
            <a
              href="https://venturesquare.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600"
            >
              VentureSquare
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
