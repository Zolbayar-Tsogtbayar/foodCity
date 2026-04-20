/**
 * Where Next.js should proxy `/upload/*` (foodcity-back static files).
 * Use an internal URL on the server (e.g. http://127.0.0.1:4000) so public nginx
 * does not need a separate `/upload` rule — the browser requests same-origin `/upload/...`.
 */
function uploadProxyOrigin() {
  const explicit =
    process.env.UPLOAD_PROXY_ORIGIN ||
    process.env.API_INTERNAL_URL ||
    process.env.SITE_CONTENT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL;
  if (explicit) {
    return String(explicit)
      .replace(/\/$/, "")
      .replace(/\/api(?:\/v\d+)?$/, "");
  }
  return "http://127.0.0.1:4000";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const origin = uploadProxyOrigin();
    return [
      {
        source: "/upload/:path*",
        destination: `${origin}/upload/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "bukhbatllc.mn", pathname: "/upload/**" },
      { protocol: "https", hostname: "bukhbatllc.mn", pathname: "/upload/**" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/upload/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/upload/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
