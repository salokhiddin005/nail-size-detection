import type { MetadataRoute } from "next";

const siteUrl = "https://nail-size-detection-y5ms.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/gallery",
          "/analyze",
          "/settings",
          "/reset-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
