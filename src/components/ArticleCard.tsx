import Link from 'next/link';
import Image from 'next/image';
import { WPPost } from '@/lib/types';
import { getFeaturedImageUrl, getAuthorName, stripHtml } from '@/lib/wordpress';
import { transformTitle, transformExcerpt } from '@/lib/rewrite';

interface ArticleCardProps {
  post: WPPost;
  priority?: boolean;
}

export default function ArticleCard({ post, priority = false }: ArticleCardProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const author = getAuthorName(post);
  const rawTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const rawExcerpt = stripHtml(post.excerpt.rendered).slice(0, 120);
  const title = transformTitle(rawTitle);
  const excerpt = transformExcerpt(rawTitle, rawExcerpt);
  const date = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group">
      <Link href={`/${post.slug}`} className="block">
        {imageUrl && (
          <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={imageUrl}
              alt={post.title.rendered.replace(/<[^>]*>/g, '')}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          </div>
        )}
        <h2 className="mb-1 text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
          {title}
        </h2>
        {excerpt && (
          <p className="mb-2 text-sm text-gray-500 line-clamp-2">{excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{author}</span>
          <span>·</span>
          <time dateTime={post.date}>{date}</time>
        </div>
      </Link>
    </article>
  );
}
