'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export const GoogleAnalytics = () => {
    useEffect(() => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'G-Z3BVVB6QT1');
      gtag('config', 'AW-11167342395');
    }, []);
  
    return (
      <>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3BVVB6QT1"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11167342395"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z3BVVB6QT1', { 'debug_mode':true });
            gtag('config', 'AW-11167342395');
          `}
        </Script>
      </>
    );
  };
