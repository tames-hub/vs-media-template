import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPostSlugs,
  getFeaturedImageUrl,
  getAuthorName,
  stripHtml,
} from '@/lib/wordpress';
import ArticleBody from '@/components/ArticleBody';
import JsonLd from '@/components/JsonLd';
import RelatedArticles from '@/components/RelatedArticles';
import CrossMediaLinks from '@/components/CrossMediaLinks';
import { transformTitle, transformMetaDescription } from '@/lib/rewrite';

export const revalidate = 600;
export const dynamicParams = true;

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: '기사를 찾을 수 없습니다' };

  const rawTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const title = transformTitle(rawTitle);
  const description = transformMetaDescription(rawTitle, stripHtml(post.excerpt.rendered).slice(0, 160));
  const imageUrl = getFeaturedImageUrl(post);
  const author = getAuthorName(post);

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [author],
      url: `https://${siteConfig.domain}/${post.slug}`,
      siteName: siteConfig.name,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    alternates: {
      canonical: `https://${siteConfig.domain}/${post.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd post={post} />
      <ArticleBody post={post} />
      <RelatedArticles posts={relatedPosts} />
      <CrossMediaLinks />
    </div>
  );
}
