import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { getPosts, getFeaturedImageUrl } from '@/lib/wordpress';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { transformTitle } from '@/lib/rewrite';

export const revalidate = 600;

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

interface HomePageProps {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const { posts, totalPages } = await getPosts(page, 13);

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-gray-500">기사가 없습니다.</p>
      </div>
    );
  }

  const heroPost = page === 1 ? posts[0] : null;
  const gridPosts = page === 1 ? posts.slice(1, 13) : posts.slice(0, 12);
  const heroImageUrl = heroPost ? getFeaturedImageUrl(heroPost) : '';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      {heroPost && (
        <Link href={`/${heroPost.slug}`} className="group mb-10 block">
          <div className="relative mb-4 aspect-[2/1] overflow-hidden rounded-xl bg-gray-100">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt={heroPost.title.rendered.replace(/<[^>]*>/g, '')}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-xl font-bold text-white sm:text-3xl leading-tight line-clamp-2">
                {transformTitle(heroPost.title.rendered.replace(/<[^>]*>/g, ''))}
              </h1>
              <p className="mt-2 text-sm text-gray-200">
                {new Date(heroPost.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {gridPosts.map((post, i) => (
          <ArticleCard key={post.id} post={post} priority={i < 3} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
