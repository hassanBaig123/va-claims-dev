// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://df17f10ad90088020c32f43587c63e5b@o4508054552576000.ingest.us.sentry.io/4508063180455936",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      // NOTE: This will disable built-in masking. Only use this if your site has no sensitive data, or if you've already set up other options for masking or blocking relevant data, such as 'ignore', 'block', 'mask' and 'maskFn'.
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],


  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV || "development",
  // Capture uncaught exceptions and unhandled promise rejections only in specific environments
  enabled: !/localhost|dev\.vaclaims/.test(process.env.NEXT_PUBLIC_BASE_URL || ''), // Disable if the base URL includes 'localhost'

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
