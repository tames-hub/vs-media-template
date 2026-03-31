import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import {
  getCategoryBySlug,
  getPostsByCategory,
  getAllCategories,
} from '@/lib/wordpress';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';

export const revalidate = 600;

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: '카테고리를 찾을 수 없습니다' };

  return {
    title: `${category.name} | ${siteConfig.name}`,
    description: category.description || `${category.name} 카테고리의 기사 목록`,
    alternates: {
      canonical: `https://${siteConfig.domain}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const { posts, totalPages } = await getPostsByCategory(category.id, page, 12);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-500">{category.description}</p>
        )}
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 py-12">이 카테고리에 기사가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <ArticleCard key={post.id} post={post} priority={i < 3} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/category/${params.slug}`}
      />
    </div>
  );
}
