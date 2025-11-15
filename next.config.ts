import {withSentryConfig} from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Configure base path for subpath deployment
// Use empty string for root deployment (development)
// Use '/user/invite' for production deployment
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/user/invite';

const nextConfig: NextConfig = {
  // Configure base path for deployment at subpath (e.g., /user/invite/)
  // This automatically prefixes all Next.js managed routes and assets
  basePath: basePath === '/' ? undefined : basePath,

  // Asset prefix ensures static assets are served from correct path
  assetPrefix: basePath === '/' ? undefined : basePath,

  // Enable static HTML export so the site can be hosted on Nginx
  output: 'export',
  // Ensure next/image does not rely on the Next.js image optimizer
  images: { unoptimized: true },
  reactCompiler: true,
  trailingSlash: true,
};

// Apply next-intl plugin first, then Sentry
export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "rrd",

  project: "ideashell-frontend",
  sentryUrl: "https://sentry.rrdtech.cn/",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});
