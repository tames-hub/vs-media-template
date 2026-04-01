import Image from 'next/image';
import { WPPost } from '@/lib/types';
import { getFeaturedImageUrl, getAuthorName } from '@/lib/wordpress';
import { siteConfig } from '@/lib/config';
import { transformTitle, transformExcerpt } from '@/lib/rewrite';

interface ArticleBodyProps {
  post: WPPost;
}

export default function ArticleBody({ post }: ArticleBodyProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const author = getAuthorName(post);
  const rawTitle = post.title.rendered.replace(/<[^>]*>/g, '');
  const title = transformTitle(rawTitle);
  const perspectiveIntro = transformExcerpt(rawTitle, '').trim();
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
    <article className="mx-auto max-w-3xl px-4 sm:px-0">
      <header className="mb-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl leading-tight">
          {title}
        </h1>
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

      {perspectiveIntro && (
        <div className="mb-6 rounded-lg border-l-4 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed" style={{ borderColor: siteConfig.themeColor }}>
          {perspectiveIntro}
        </div>
      )}

      <div
        className="prose prose-gray max-w-none overflow-hidden prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline break-words [word-break:keep-all]"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
