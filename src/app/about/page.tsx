import { Metadata } from 'next';
import { siteConfig, crossMediaLinks } from '@/lib/config';
import { OrganizationJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: `소개 | ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: {
    canonical: `https://${siteConfig.domain}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <OrganizationJsonLd />

      <h1 className="mb-6 text-3xl font-bold text-gray-900">{siteConfig.name}</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed">{siteConfig.description}</p>

        <p className="mt-4 text-gray-600">
          {siteConfig.name}은(는){' '}
          <a
            href="https://venturesquare.net"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
            style={{ color: siteConfig.themeColor }}
          >
            벤처스퀘어(VentureSquare)
          </a>{' '}
          미디어 네트워크의 일부로, 전문적이고 깊이 있는 콘텐츠를 제공합니다.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">미디어 네트워크</h2>
        <p className="text-gray-600">
          벤처스퀘어 미디어 네트워크는 스타트업 생태계의 다양한 분야를 전문적으로
          다루는 매체들로 구성되어 있습니다.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {crossMediaLinks.map((media) => (
            <a
              key={media.domain}
              href={`https://${media.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 no-underline ${
                media.domain === siteConfig.domain ? 'border-2 bg-gray-50' : ''
              }`}
              style={
                media.domain === siteConfig.domain
                  ? { borderColor: siteConfig.themeColor }
                  : undefined
              }
            >
              <div>
                <span className="font-medium text-gray-900">{media.name}</span>
                <p className="mt-0.5 text-sm text-gray-500">{media.description}</p>
              </div>
              {media.domain === siteConfig.domain && (
                <span
                  className="text-xs font-medium rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: `${siteConfig.themeColor}15`,
                    color: siteConfig.themeColor,
                  }}
                >
                  현재
                </span>
              )}
            </a>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-bold text-gray-900">연락처</h2>
        <ul className="text-gray-600">
          <li>
            웹사이트:{' '}
            <a href={`https://${siteConfig.domain}`} style={{ color: siteConfig.themeColor }}>
              https://{siteConfig.domain}
            </a>
          </li>
          <li>
            원본 매체:{' '}
            <a
              href="https://venturesquare.net"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: siteConfig.themeColor }}
            >
              https://venturesquare.net
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
