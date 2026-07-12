import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/image"],
        disallow: [
          "/api/",
          "/_next/",
          "/*/opengraph-image",
        ],
      },
    ],
    sitemap: "https://appalachiancryptid.com/sitemap.xml",
  };
}
