import process from "node:process";

/** @type {import("next").NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  pageExtensions: ["ts", "tsx"],
  rewrites: async () => [
    {
      source: "/flask-api/:path*",
      destination:
        process.env.NODE_ENV === "development" ? "http://127.0.0.1:5000/api/:path*" : "/api/",
    },
  ],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
