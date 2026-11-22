import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The old trainer area moved into the admin panel.
  async redirects() {
    return [
      { source: "/trainer", destination: "/admin/classes", permanent: true },
      { source: "/trainer/:path*", destination: "/admin/:path*", permanent: true },
      // Pages removed from the website (no invented trainers, reviews or offline activities).
      { source: "/trainers", destination: "/about", permanent: true },
      { source: "/success-stories", destination: "/", permanent: true },
      { source: "/beyond-the-classroom", destination: "/how-it-works", permanent: true },
      { source: "/corporate", destination: "/contact", permanent: true },
      { source: "/courses/:slug", destination: "/courses", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
