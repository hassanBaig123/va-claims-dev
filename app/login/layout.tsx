export const dynamic = 'force-dynamic'

import '../globals.css'
import Head from 'next/head'
import type { Metadata } from 'next'
import Footer from '@/components/home/footer'

import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'VA Claims Academy',
  description: 'Helping win their VA Rating',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="VA Claims Academy offers personalized guidance for veterans navigating the complex VA disability claim process. Our expert team provides custom-tailored tools, strategies, and support to help you maximize your benefits and achieve the best possible outcome. Discover how our proven approach, including the Complete VetVictory Claim Guide, custom personal statement templates, and Nexus letters, can help you get the benefits you deserve. Choose from our transparent, one-time payment packages and start your journey to success with VA Claims Academy today."
        />
        <meta property="og:title" content="VA Claims Academy" />
        <meta
          property="og:description"
          content="Helping veterans win their VA Rating with personalized guidance and expert support."
        />
        <meta
          property="og:image"
          content="https://vaclaims-academy.com/imgs/site-preview.jpg"
        />
        <meta property="og:url" content="https://www.vaclaims-academy.com" />
        <meta property="og:type" content="website" />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Footer />
    </>
  )
}
