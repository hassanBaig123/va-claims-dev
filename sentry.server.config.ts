// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://df17f10ad90088020c32f43587c63e5b@o4508054552576000.ingest.us.sentry.io/4508063180455936",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  environment: process.env.NODE_ENV || "development",
  // Capture uncaught exceptions and unhandled promise rejections only in specific environments
  enabled: !/localhost|dev\.vaclaims/.test(process.env.NEXT_PUBLIC_BASE_URL || ''), // Disable if the base URL includes 'localhost'

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
