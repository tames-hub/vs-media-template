export const siteConfig = {
  name: process.env.SITE_NAME || '벤처스퀘어',
  domain: process.env.SITE_DOMAIN || 'venturesquare.net',
  description: process.env.SITE_DESCRIPTION || '한국 스타트업 미디어',
  wpApiUrl: process.env.WP_API_URL || 'https://venturesquare.net/wp-json/wp/v2',
  categorySlug: process.env.WP_CATEGORY_SLUG || '',
  tagSlugs: process.env.WP_TAG_SLUGS || '',
  themeColor: process.env.THEME_COLOR || '#1a56db',
  gaId: process.env.GA_ID || '',
  revalidateSecret: process.env.REVALIDATE_SECRET || '',
  revalidate: 600, // 10 minutes
} as const;

export const crossMediaLinks = [
  { domain: 'vsq.net', name: 'VSQ 투자', description: '투자/VC 소식' },
  { domain: 'vsq.news', name: 'VSQ 뉴스', description: '최신 뉴스' },
  { domain: 'koreastartup.kr', name: '코리아스타트업', description: '인터뷰/뉴스' },
  { domain: 'startuplive.kr', name: '스타트업라이브', description: '이벤트' },
  { domain: 'letter4ceo.com', name: 'Letter for CEO', description: '가이드' },
  { domain: 'startupnomad.net', name: '스타트업노마드', description: '글로벌 소식' },
  { domain: 'sparksquare.net', name: '스파크스퀘어', description: 'AI/딥테크' },
  { domain: 'vsq.studio', name: 'VSQ 스튜디오', description: '스페셜 콘텐츠' },
  { domain: 'startupsquare.net', name: '스타트업스퀘어', description: '스타트업/채용' },
] as const;
