import { siteConfig } from '@/lib/config';

export async function GET() {
  const content = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name}은(는) venturesquare.net 미디어 네트워크의 일부로, ${siteConfig.description}를 제공합니다.

## 주요 콘텐츠
- 스타트업 뉴스 및 분석
- 투자/VC 소식
- 기술 트렌드

## 연락처
- 웹사이트: https://${siteConfig.domain}
- 원본 매체: https://venturesquare.net
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
