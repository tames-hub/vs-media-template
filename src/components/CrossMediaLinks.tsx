import { siteConfig, crossMediaLinks } from '@/lib/config';

export default function CrossMediaLinks() {
  const otherMedia = crossMediaLinks.filter((m) => m.domain !== siteConfig.domain);

  // Pick 3 random related media
  const shuffled = [...otherMedia].sort(() => 0.5 - Math.random()).slice(0, 3);

  const suggestions: Record<string, string> = {
    'vsq.net': '투자/VC 관련 소식은',
    'vsq.news': '최신 뉴스는',
    'koreastartup.kr': '이 기업의 창업자 인터뷰는',
    'startuplive.kr': '스타트업 이벤트 소식은',
    'letter4ceo.com': 'CEO를 위한 가이드는',
    'startupnomad.net': '글로벌 스타트업 소식은',
    'sparksquare.net': 'AI/딥테크 심층 분석은',
    'vsq.studio': '스페셜 콘텐츠는',
    'startupsquare.net': '스타트업/채용 소식은',
  };

  return (
    <section className="mt-10 rounded-lg bg-gray-50 p-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">더 많은 이야기</h3>
      <div className="space-y-2">
        {shuffled.map((media) => (
          <p key={media.domain} className="text-sm text-gray-600">
            {suggestions[media.domain] || '관련 소식은'}{' '}
            <a
              href={`https://${media.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
              style={{ color: siteConfig.themeColor }}
            >
              {media.name}
            </a>
            에서 보기
          </p>
        ))}
      </div>
    </section>
  );
}
