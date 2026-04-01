import { siteConfig } from './config';

/**
 * 매체별 콘텐츠 차별화 모듈
 * - 제목 앞에 매체 관점 태그 추가
 * - 도입부에 매체 관점 요약 문장 삽입
 * - canonical은 각 매체 자체 URL (중복 아님)
 */

// 매체별 제목 변형 규칙
const TITLE_TRANSFORMS: Record<string, (title: string) => string> = {
  'vsq.net': (t) => `[투자] ${t}`,
  'vsq.news': (t) => t, // 뉴스는 원본 유지
  'koreastartup.kr': (t) => `[심층분석] ${t}`,
  'startuplive.kr': (t) => `[현장] ${t}`,
  'letter4ceo.com': (t) => `[CEO 인사이트] ${t}`,
  'startupnomad.net': (t) => `[글로벌] ${t}`,
  'sparksquare.net': (t) => `[테크] ${t}`,
  'vsq.studio': (t) => t, // 스튜디오는 원본 유지
  'startupsquare.net': (t) => `[피플] ${t}`,
};

// 매체별 도입부 관점 문장 생성
const PERSPECTIVE_INTROS: Record<string, (title: string, excerpt: string) => string> = {
  'vsq.net': (t, e) =>
    `투자 전문 매체 VSQ 투자가 분석한 이번 소식의 핵심은 자본 시장의 움직임에 있다. ` + e,
  'vsq.news': (_t, e) => e,
  'koreastartup.kr': (t, e) =>
    `한국 스타트업 생태계의 맥락에서 이번 소식을 심층 분석한다. ` + e,
  'startuplive.kr': (t, e) =>
    `현장에서 포착한 스타트업 업계의 최신 동향이다. ` + e,
  'letter4ceo.com': (t, e) =>
    `경영자가 주목해야 할 이번 소식의 시사점을 정리했다. ` + e,
  'startupnomad.net': (t, e) =>
    `글로벌 시장 관점에서 바라본 이번 소식의 의미를 짚어본다. ` + e,
  'sparksquare.net': (t, e) =>
    `기술 혁신의 관점에서 이번 소식이 갖는 의미를 분석한다. ` + e,
  'vsq.studio': (_t, e) => e,
  'startupsquare.net': (t, e) =>
    `스타트업을 만드는 사람들의 이야기, 그 중심에서 전한다. ` + e,
};

/**
 * 매체별로 제목을 변형합니다
 */
export function transformTitle(originalTitle: string): string {
  const transform = TITLE_TRANSFORMS[siteConfig.domain];
  if (transform) return transform(originalTitle);
  return originalTitle;
}

/**
 * 매체별로 도입부(excerpt)를 변형합니다
 */
export function transformExcerpt(originalTitle: string, originalExcerpt: string): string {
  const transform = PERSPECTIVE_INTROS[siteConfig.domain];
  if (transform) return transform(originalTitle, originalExcerpt);
  return originalExcerpt;
}

/**
 * 매체별 관점 메타 설명 생성 (SEO용)
 */
export function transformMetaDescription(originalTitle: string, originalDesc: string): string {
  const perspectives: Record<string, string> = {
    'vsq.net': `투자/VC 관점에서 분석한 ${originalTitle}`,
    'koreastartup.kr': `한국 스타트업 심층 분석: ${originalTitle}`,
    'startuplive.kr': `현장 리포트: ${originalTitle}`,
    'letter4ceo.com': `CEO를 위한 인사이트: ${originalTitle}`,
    'startupnomad.net': `글로벌 관점에서 본 ${originalTitle}`,
    'sparksquare.net': `기술/딥테크 분석: ${originalTitle}`,
    'startupsquare.net': `스타트업 피플 스토리: ${originalTitle}`,
  };
  return perspectives[siteConfig.domain] || originalDesc;
}
