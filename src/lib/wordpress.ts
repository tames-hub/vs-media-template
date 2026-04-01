import { siteConfig } from './config';
import type { WPPost, WPCategory, WPTag, PostsResponse } from './types';

const API_URL = siteConfig.wpApiUrl;

async function fetchAPI<T>(endpoint: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...init,
      next: { revalidate: siteConfig.revalidate },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchAPIWithHeaders(
  endpoint: string,
  init?: RequestInit
): Promise<{ data: WPPost[] | null; totalPages: number; total: number }> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...init,
      next: { revalidate: siteConfig.revalidate },
    });
    if (!res.ok) return { data: null, totalPages: 0, total: 0 };
    const data = await res.json();
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '0', 10);
    const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    return { data, totalPages, total };
  } catch {
    return { data: null, totalPages: 0, total: 0 };
  }
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const cats = await fetchAPI<WPCategory[]>(`/categories?slug=${encodeURIComponent(slug)}`);
  return cats?.[0] || null;
}

export async function getTagBySlug(slug: string): Promise<WPTag | null> {
  const tags = await fetchAPI<WPTag[]>(`/tags?slug=${encodeURIComponent(slug)}`);
  return tags?.[0] || null;
}

async function resolveFilterParams(): Promise<string> {
  const params: string[] = [];

  if (siteConfig.categorySlug) {
    const slugs = siteConfig.categorySlug.split(',').map((s) => s.trim()).filter(Boolean);
    const ids: number[] = [];
    for (const slug of slugs) {
      const cat = await getCategoryBySlug(slug);
      if (cat) ids.push(cat.id);
    }
    if (ids.length > 0) params.push(`categories=${ids.join(',')}`);
  }

  if (siteConfig.tagSlugs) {
    const slugs = siteConfig.tagSlugs.split(',').map((s) => s.trim()).filter(Boolean);
    const ids: number[] = [];
    for (const slug of slugs) {
      const tag = await getTagBySlug(slug);
      if (tag) ids.push(tag.id);
    }
    if (ids.length > 0) params.push(`tags=${ids.join(',')}`);
  }

  return params.join('&');
}

export async function getPosts(page: number = 1, perPage: number = 12): Promise<PostsResponse> {
  const filterParams = await resolveFilterParams();
  const queryParts = [
    `per_page=${perPage}`,
    `page=${page}`,
    '_embed',
  ];
  if (filterParams) queryParts.push(filterParams);

  const { data, totalPages, total } = await fetchAPIWithHeaders(
    `/posts?${queryParts.join('&')}`
  );

  return {
    posts: data || [],
    totalPages,
    total,
  };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  // Handle double-encoded Korean slugs from Next.js routing
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // already decoded
  }
  const posts = await fetchAPI<WPPost[]>(
    `/posts?slug=${encodeURIComponent(decodedSlug)}&_embed`
  );
  return posts?.[0] || null;
}

export async function getPostsByCategory(
  categoryId: number,
  page: number = 1,
  perPage: number = 12
): Promise<PostsResponse> {
  const { data, totalPages, total } = await fetchAPIWithHeaders(
    `/posts?categories=${categoryId}&per_page=${perPage}&page=${page}&_embed`
  );
  return {
    posts: data || [],
    totalPages,
    total,
  };
}

export async function getRelatedPosts(
  post: WPPost,
  limit: number = 4
): Promise<WPPost[]> {
  const categoryIds = post.categories?.join(',');
  if (!categoryIds) return [];

  const posts = await fetchAPI<WPPost[]>(
    `/posts?categories=${categoryIds}&per_page=${limit + 1}&exclude=${post.id}&_embed`
  );

  return (posts || []).filter((p) => p.id !== post.id).slice(0, limit);
}

export async function getAllPostSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  const maxPages = 3; // Limit for build time, rest via ISR

  const filterParams = await resolveFilterParams();

  while (page <= maxPages) {
    const queryParts = [
      `per_page=50`,
      `page=${page}`,
      '_fields=slug',
    ];
    if (filterParams) queryParts.push(filterParams);

    try {
      const res = await fetch(`${API_URL}/posts?${queryParts.join('&')}`, {
        next: { revalidate: siteConfig.revalidate },
      });
      if (!res.ok) break;
      const posts: Array<{ slug: string }> = await res.json();
      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '0', 10);
      slugs.push(...posts.map((p) => {
      try { return decodeURIComponent(p.slug); } catch { return p.slug; }
    }));
      if (page >= totalPages) break;
    } catch {
      break;
    }
    page++;
  }

  return slugs;
}

export async function getAllCategories(): Promise<WPCategory[]> {
  const cats = await fetchAPI<WPCategory[]>('/categories?per_page=100');
  return cats || [];
}

// Utility functions
export function getFeaturedImageUrl(post: WPPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return '';
  return (
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.source_url ||
    ''
  );
}

export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name || '편집부';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
}
