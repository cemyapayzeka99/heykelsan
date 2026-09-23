import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://heykelsan-80dc7.web.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
