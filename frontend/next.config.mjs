/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import withBundleAnalyzer from "@next/bundle-analyzer";
import withNextIntl from "next-intl/plugin";
import path, { dirname } from "path";
// Import the path module for directory manipulation
const __dirname = dirname(new URL(import.meta.url).pathname);

const withNextIntlConfig = withNextIntl("./src/libs/i18n.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntlConfig({
    async rewrites() {
      return [
        {
          source: "/api/v1/:path*",
          destination: "https://api-dev.acanet.io/api/v1/:path*",
          // destination: "http://192.168.100.188:3001/api/v1/:path*",
        },
      ];
    },
    async headers() {
      return [
        {
          source: "/api/v1/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            },
            {
              key: "Access-Control-Allow-Headers",
              value:
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization",
            },
          ],
        },
      ];
    },
    eslint: {
      dirs: ["."],
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      serverComponentsExternalPackages: ["@electric-sql/pglite"],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, "./src/styles")],
    },
    images: {
      domains: [
        "via.placeholder.com",
        "lh3.googleusercontent.com",
        "acanet-v1-public-test.s3.amazonaws.com",
      ],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
    i18n: {
      locales: ["en", "vi"],
      defaultLocale: "en",
    },
  }),
);
