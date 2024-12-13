'use client'
import { useEffect, useState } from 'react'
import Hero from '@/components/home/hero'

import { FAQ } from '@/components/home/faq'
import SocialLinks from '@/components/home/sociallinks'
import Problems from '@/components/home/problems'
import Benefits from '@/components/home/benefits'
import SocialProofCarousel from '@/components/home/socialproof-carousel'
import Pricing from '@/components/learn-more/pricing'
import IntroductionSection from '@/components/home/introductionsection'
import OthersCharges from '@/components/learn-more/otherscharge'
import PremiumBonuses from '@/components/home/premiumbonuses'
import Guarantee from '@/components/learn-more/guarantee'
import ClearPathLongWhite from '@/components/learn-more/clearpathwhite'
import NexusLongLight from '@/components/learn-more/nexuslonglight'
import SuccessFailureDialog from '@/components/learn-more/success-failure-dialog'
import ErrorDialog from '@/components/learn-more/ErrorDialog'
import CallToAction from '@/components/home/CallToAction'
import Countdown from '@/components/home/countdown'
import PromoBanner from '@/components/home/promo-banner'

export default function Home() {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successModal, setSuccessModal] = useState<boolean | string>('')

  const onError = (message: string) => {
    setErrorMessage(message)
    setIsErrorDialogOpen(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Extract the search parameters from the URL
      const searchParams = new URLSearchParams(window.location.search)
      const success = searchParams.get('success')
      const failed = searchParams.get('failed')
      const error = searchParams.get('error')
      failed && error && onError(error)
      setSuccessModal(success ? true : failed ? false : '')
    }
  }, []) // Only run once on component mount

  return (
    <div className="flex-auto ">
      <Hero />      
      <Countdown />
      <SocialProofCarousel />
      <Problems />
      <IntroductionSection />
      <CallToAction />
      <Benefits />
      <PremiumBonuses />
      <NexusLongLight />
      <ClearPathLongWhite />
      {/* <Features /> */}
      <OthersCharges />

      <Pricing />
      <Guarantee bgColor="bg-white" />
      {/* <WhatWeDontDoHome /> */}
      <SocialProofCarousel
        title="Verified Testimonials"
        bgColor="bg-backgoundPlatinum"
      />
      <span id="pricing-section2"></span>
      <Pricing />
      <Guarantee bgColor="bg-oxfordBlue" />
      <FAQ />
      {/* <LearnMore /> */}
      <SocialLinks />

      {/* success and error modal */}
      {!!successModal && (
        <SuccessFailureDialog
          {...{
            isOpen: !!successModal,
            onOpenChange: setSuccessModal,
          }}
        />
      )}
      <ErrorDialog
        isOpen={isErrorDialogOpen}
        message={errorMessage || ''}
        onOpenChange={setIsErrorDialogOpen}
      />
    </div>
  )
}
