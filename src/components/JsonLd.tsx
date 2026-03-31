import { WPPost } from '@/lib/types';
import { siteConfig } from '@/lib/config';
import { getFeaturedImageUrl, getAuthorName } from '@/lib/wordpress';

interface JsonLdProps {
  post: WPPost;
}

export default function JsonLd({ post }: JsonLdProps) {
  const imageUrl = getFeaturedImageUrl(post);
  const author = getAuthorName(post);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title.rendered.replace(/<[^>]*>/g, ''),
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `https://${siteConfig.domain}`,
      logo: {
        '@type': 'ImageObject',
        url: `https://${siteConfig.domain}/logo.png`,
      },
    },
    mainEntityOfPage: `https://${siteConfig.domain}/${post.slug}`,
    ...(imageUrl && { image: imageUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: `https://${siteConfig.domain}`,
    description: siteConfig.description,
    logo: `https://${siteConfig.domain}/logo.png`,
    sameAs: ['https://venturesquare.net'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
