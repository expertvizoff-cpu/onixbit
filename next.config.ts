import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/tg",
        destination: "https://t.me/onixbitru",
        permanent: false,
      },
      {
        source: "/vk",
        destination: "https://vk.com/onixbitru",
        permanent: false,
      },
      {
        source: "/max",
        destination:
          "https://max.ru/u/f9LHodD0cOLKUnPeYPhOm53_bhpzOik5pDQLlBzjW8ZsbaCekC8Vlm0o6AA",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/vnedrenie-bitrix24",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/razrabotka-saitov-na-1c-bitrix",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/raboty-po-1c-predpriyatie",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/chunks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      disableLogger: true,
    })
  : nextConfig;
