/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  reactStrictMode: false,

  distDir: 'build',
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.pixabay.com',
      'vumbnail.com',
      'img.youtube.com',
      'strapi-va-claims.s3.us-west-2.amazonaws.com',
    ],
  },
  // experimental: {
  //   turbotrace: {
  //     logLevel: 'info',
  //   },
  // },
  //eslint: {
  //  ignoreDuringBuilds: true,
  //},
  //typescript: {
  //  ignoreBuildErrors: true,
  //},
  productionBrowserSourceMaps: true,
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    AGENCY_TASKS_CALLBACK_TOPIC: process.env.AGENCY_TASKS_CALLBACK_TOPIC,
    AGENCY_TASKS_ERROR_TOPIC: process.env.AGENCY_TASKS_ERROR_TOPIC,
    AGENCY_TASKS_TOPIC: process.env.AGENCY_TASKS_TOPIC,
    KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL,
    MAINSESSIONS_TOPIC: process.env.MAINSESSIONS_TOPIC,
    ONLINE_TOPIC: process.env.ONLINE_TOPIC,
    PORT: process.env.PORT,
    REDIS_URL: process.env.REDIS_URL,
    SUPABASE_AUTH_JWT_SECRET: process.env.SUPABASE_AUTH_JWT_SECRET,
    SUPABASE_AUTH_SERVICE_ROLE_KEY: process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY,
    SUPABASE_DB_PASSWORD: process.env.SUPABASE_DB_PASSWORD,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GMAIL_USER: process.env.GMAIL_USER,
  },
}

module.exports = nextConfig

// Injected content via Sentry wizard below

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'the-intent-network',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})
