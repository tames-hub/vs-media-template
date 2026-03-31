import Image from 'next/image';
import { WPPost } from '@/lib/types';
import { getFeaturedImageUrl, getAuthorName } from '@/lib/wordpress';
import { siteConfig } from '@/lib/config';

interface ArticleBodyProps {
  post: WPPost;
}

export default function ArticleBody({ post }: ArticleBodyProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const author = getAuthorName(post);
  const date = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const modified = new Date(post.modified).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1
          className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{author}</span>
          <span>·</span>
          <time dateTime={post.date}>{date}</time>
          {date !== modified && (
            <>
              <span>·</span>
              <span className="text-xs">수정 {modified}</span>
            </>
          )}
        </div>
        {post._embedded?.['wp:term'] && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post._embedded['wp:term'].flat().map((term) => (
              <span
                key={`${term.taxonomy}-${term.id}`}
                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${siteConfig.themeColor}15`,
                  color: siteConfig.themeColor,
                }}
              >
                {term.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {imageUrl && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageUrl}
            alt={post.title.rendered.replace(/<[^>]*>/g, '')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-gray max-w-none prose-img:rounded-lg prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
