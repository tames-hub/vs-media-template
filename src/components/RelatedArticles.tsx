import Link from 'next/link';
import Image from 'next/image';
import { WPPost } from '@/lib/types';
import { getFeaturedImageUrl } from '@/lib/wordpress';

interface RelatedArticlesProps {
  posts: WPPost[];
}

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-lg font-bold text-gray-900">관련 기사</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => {
          const imageUrl = getFeaturedImageUrl(post);
          return (
            <Link key={post.id} href={`/${post.slug}`} className="group block">
              {imageUrl && (
                <div className="relative mb-2 aspect-video overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={post.title.rendered.replace(/<[^>]*>/g, '')}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              )}
              <h3
                className="text-sm font-medium text-gray-800 group-hover:text-gray-500 transition-colors line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
