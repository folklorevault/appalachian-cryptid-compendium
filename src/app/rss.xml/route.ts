import { fetchFeedItems } from "@/lib/sanity/fetchers";
import type { FeedItem } from "@/types/sanity";

const SITE_URL = "https://appalachiancryptid.com";
const FEED_TITLE = "Appalachian Cryptid Bureau — Field Dispatches";
const FEED_DESCRIPTION =
  "New cryptid case files, anomaly reports, and bulletins from the Appalachian Cryptid Bureau.";

// Revalidate hourly as a backstop; Sanity webhooks purge the
// cryptids/anomalies/bulletins tags on publish for near-instant updates.
export const revalidate = 3600;

const PATH_BY_TYPE: Record<FeedItem["_type"], string> = {
  cryptid: "/cryptid/",
  anomaly: "/anomaly/",
  bulletin: "/bulletin/",
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? new Date(0).toUTCString()
    : parsed.toUTCString();
}

export async function GET() {
  const items = await fetchFeedItems();

  const lastBuildDate = items[0]
    ? toRfc822(items[0].publishedAt)
    : new Date(0).toUTCString();

  const itemsXml = items
    .map((item) => {
      const link = `${SITE_URL}${PATH_BY_TYPE[item._type]}${item.slug}`;
      const description = item.summary ? escapeXml(item.summary) : "";
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${toRfc822(item.publishedAt)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
