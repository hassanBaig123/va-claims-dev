import React from 'react'
import VADisabilityCalculatorPage from '../../../components/va-calculator/VADisabilityCalculatorPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'VA Disability Calculator | Calculate Your VA Disability Rating & Compensation',
  description:
    'Use our free VA Disability Calculator to estimate your combined VA disability rating and monthly compensation. Find out how much you could receive from the VA.',
  keywords:
    'VA disability calculator, VA disability rating, VA compensation, veteran benefits',
  openGraph: {
    title:
      'VA Disability Calculator | Calculate Your VA Disability Rating & Compensation',
    description:
      'Use our free VA Disability Calculator to estimate your combined VA disability rating and monthly compensation.',
    url: 'https://vaclaims-academy.com/va-disability-calculator',
    type: 'website',
    images: [
      {
        url: 'https://vaclaims-academy.com/images/va-calculator-og-image.jpg',
        width: 800,
        height: 600,
        alt: 'VA Disability Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'VA Disability Calculator | Calculate Your VA Disability Rating & Compensation',
    description:
      'Estimate your combined VA disability rating and monthly compensation with our free VA Disability Calculator.',
    images: [
      'https://vaclaims-academy.com/images/va-calculator-twitter-image.jpg',
    ],
  },
  alternates: {
    canonical: 'https://vaclaims-academy.com/va-disability-calculator',
  },
  robots: 'index, follow',
}

const VAClaimsCalculator = () => {
  return <VADisabilityCalculatorPage />
}

export default VAClaimsCalculator
