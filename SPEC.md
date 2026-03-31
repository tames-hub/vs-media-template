# VS Media Template - Next.js 14 공통 템플릿

## 개요
벤처스퀘어 WordPress REST API를 데이터 소스로 사용하는 SSG+ISR Next.js 14 (App Router) 템플릿.
환경변수만 바꿔서 9개 매체를 각각 독립 배포.

## 기술 스택
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (미니멀 미디어 레이아웃)
- SSG + ISR (revalidate 600초 = 10분)
- Vercel 배포

## 환경변수 (.env.example)
```
SITE_NAME=스파크스퀘어
SITE_DOMAIN=sparksquare.net
SITE_DESCRIPTION=한국 AI/딥테크 스타트업 전문 미디어
WP_API_URL=https://venturesquare.net/wp-json/wp/v2
WP_CATEGORY_SLUG=
WP_TAG_SLUGS=ai,deeptech,saas,blockchain
THEME_COLOR=#FF6B35
GA_ID=G-XXXXXXX
REVALIDATE_SECRET=your-secret-here
```

## 9개 매체 설정
| 도메인 | 매체명 | 카테고리 슬러그 | 태그 슬러그 | 테마컬러 |
|--------|--------|----------------|-------------|----------|
| vsq.net | VSQ 투자 | - | 투자,VC,시리즈,엑시트,IPO | #1a56db |
| vsq.news | VSQ 뉴스 | news-trends | - | #e02424 |
| koreastartup.kr | 코리아스타트업 | interview-news | - | #057a55 |
| startuplive.kr | 스타트업라이브 | events-2 | - | #9061f9 |
| letter4ceo.com | Letter for CEO | guide | - | #c27803 |
| startupnomad.net | 스타트업노마드 | - | 글로벌,해외,북미,동남아,유럽 | #0e9f6e |
| sparksquare.net | 스파크스퀘어 | - | AI,딥테크,SaaS,블록체인,핀테크 | #FF6B35 |
| vsq.studio | VSQ 스튜디오 | special-post | - | #111827 |
| startupsquare.net | 스타트업스퀘어 | startup,recruiting | - | #3f83f8 |

## 페이지 구성

### 1. 메인 페이지 `/`
- 히어로: 최신 기사 1개 (큰 이미지 + 제목)
- 최신 기사 목록 (그리드 레이아웃, 12개)
- 페이지네이션
- SSG + ISR 10분

### 2. 기사 상세 `/[slug]`
- 기사 본문 (WordPress content HTML 렌더)
- JSON-LD NewsArticle 스키마
- OG 메타태그
- 관련 기사 3~4개
- 하단: 관련 매체 링크 ("이 기업의 창업자 인터뷰는 koreastartup.kr에서 보기" 등)
- SSG + ISR

### 3. 카테고리 페이지 `/category/[slug]`
- 카테고리별 기사 목록
- 페이지네이션

### 4. About 페이지 `/about`
- 매체 소개 (env 기반 동적 생성)
- Schema.org Organization JSON-LD

### 5. 정적 파일
- `/llms.txt` - AI 크롤러용 사이트 설명 (env 기반)
- `/sitemap.xml` - 자동 생성 (next-sitemap)
- `/robots.txt` - AI 크롤러 Allow 설정
- `/rss.xml` - RSS 피드

### 6. API Routes
- `/api/revalidate` - On-demand ISR revalidation (secret 토큰 인증)

## AI 크롤링 최적화 (필수)

### robots.txt
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://${SITE_DOMAIN}/sitemap.xml
```

### llms.txt
```
# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME}은(는) venturesquare.net 미디어 네트워크의 일부로, ${SITE_DESCRIPTION}를 제공합니다.

## 주요 콘텐츠
- 스타트업 뉴스 및 분석
- 투자/VC 소식
- 기술 트렌드

## 연락처
- 웹사이트: https://${SITE_DOMAIN}
- 원본 매체: https://venturesquare.net
```

### JSON-LD (모든 기사)
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "기사 제목",
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-01",
  "author": { "@type": "Person", "name": "작성자" },
  "publisher": {
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "url": "https://${SITE_DOMAIN}",
    "logo": { "@type": "ImageObject", "url": "https://${SITE_DOMAIN}/logo.png" }
  },
  "mainEntityOfPage": "https://${SITE_DOMAIN}/article-slug",
  "image": "기사 이미지 URL"
}
```

### Canonical URL
- 각 매체 기사의 canonical = 해당 매체 URL (중복 아님, AI 리라이트됨)

## 디자인
- 미니멀, 텍스트 중심
- 흰 배경, THEME_COLOR는 헤더/액센트에만 사용
- 로딩 속도 최우선 (이미지 lazy load, next/image)
- 반응형 (모바일 퍼스트)
- 폰트: Pretendard (한글) + Inter (영문)

## WordPress API 호출
- 기사 목록: `GET /wp/v2/posts?categories={id}&tags={id}&per_page=12&page={n}&_embed`
- 기사 상세: `GET /wp/v2/posts?slug={slug}&_embed`
- 카테고리: `GET /wp/v2/categories?slug={slug}`
- 태그: `GET /wp/v2/tags?slug={slug}`
- `_embed` 파라미터로 featured_media, author 등 포함

## 파일 구조
```
src/
  app/
    layout.tsx          # 공통 레이아웃 (THEME_COLOR, GA, 메타)
    page.tsx            # 메인 (기사 목록)
    [slug]/page.tsx     # 기사 상세
    category/[slug]/page.tsx  # 카테고리
    about/page.tsx      # About
    api/revalidate/route.ts   # ISR 트리거
    robots.ts           # robots.txt
    sitemap.ts          # sitemap.xml
    llms.txt/route.ts   # llms.txt
    rss.xml/route.ts    # RSS
  lib/
    wordpress.ts        # WP API 클라이언트
    config.ts           # 환경변수 통합 관리
    types.ts            # TypeScript 타입
  components/
    Header.tsx
    Footer.tsx
    ArticleCard.tsx
    ArticleBody.tsx
    JsonLd.tsx
    Pagination.tsx
    RelatedArticles.tsx
    CrossMediaLinks.tsx
```

## 빌드 & 배포
- `npm run build` → SSG 페이지 생성
- Vercel에 9번 배포, 각각 다른 env
- `next.config.js`에 `images.remotePatterns`으로 venturesquare.net 허용

## 중요
- WordPress API 인증 불필요 (공개 기사만 가져옴)
- 에러 처리: API 실패 시 빈 목록 반환 (빌드 실패 방지)
- 이미지: next/image로 최적화, venturesquare.net 이미지 프록시
