declare global {
  interface Window {
    dataLayer: any[];
  }
}

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { Montserrat } from "next/font/google";
import { twMerge } from "tailwind-merge";
import AppStateProvider from "@/lib/providers/state-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { GoogleAnalytics } from "@/components/global/google-analytics";
import { CookieConsent } from "@/components/global/cookie-consent"; // Import CookieConsent

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "VA Claims Academy",
  description: "VA CLAIMS ARE CONFUSING.  We're Here To Make It Easy.",
};

// async function initializeServerSideListeners() {
//   if (typeof window === 'undefined') {
//     await initSupabaseListener();
//   }
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //await initializeServerSideListeners();

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={twMerge("bg-background", montserrat.variable, "font-sans")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppStateProvider>
            <SupabaseUserProvider>
              {children}
              <Toaster />
              <GoogleAnalytics />
              <CookieConsent />
            </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
        {/* <script src="https://unpkg.com/taos@1.0.5/dist/taos.js"></script> */}
      </body>
    </html>
  );
}
