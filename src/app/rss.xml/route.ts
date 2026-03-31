import { siteConfig } from '@/lib/config';
import { getPosts, getFeaturedImageUrl, getAuthorName, stripHtml } from '@/lib/wordpress';

export async function GET() {
  const { posts } = await getPosts(1, 20);
  const baseUrl = `https://${siteConfig.domain}`;

  const items = posts
    .map((post) => {
      const title = post.title.rendered.replace(/<[^>]*>/g, '');
      const description = stripHtml(post.excerpt.rendered).slice(0, 300);
      const author = getAuthorName(post);
      const imageUrl = getFeaturedImageUrl(post);
      const pubDate = new Date(post.date).toUTCString();

      return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>${
        imageUrl
          ? `
      <media:content url="${imageUrl}" medium="image" />`
          : ''
      }
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
    },
  });
}
