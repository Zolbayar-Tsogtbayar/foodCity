/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "bukhbatllc.mn", pathname: "/upload/**" },
      { protocol: "https", hostname: "bukhbatllc.mn", pathname: "/upload/**" },
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/upload/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/upload/**" },
    ],
  },
};

export default nextConfig;
