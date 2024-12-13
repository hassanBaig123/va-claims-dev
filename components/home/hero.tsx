'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReviewScores from './review-scores'
import AngleElement from '../angledesign'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import PromoBanner from './promo-banner'

declare global {
  interface Window {
    Vimeo: any
  }
}

export default function Hero() {
  const videoRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    // Defer Vimeo loading until the component mounts
    const loadVimeo = () => {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      script.async = true
      script.onload = initializeVimeoPlayer
      document.body.appendChild(script)
    }

    // Check if Vimeo is already loaded
    if (window.Vimeo) {
      initializeVimeoPlayer()
    } else {
      setTimeout(loadVimeo, 1000) // Slight delay to prioritize LCP
    }

    return () => {
      // Remove script if necessary (for cleanup)
      document.body
        .querySelectorAll(
          'script[src="https://player.vimeo.com/api/player.js"]',
        )
        .forEach((script) => script.remove())
    }
  }, [])

  const initializeVimeoPlayer = () => {
    if (videoRef.current && window.Vimeo) {
      playerRef.current = new window.Vimeo.Player(videoRef.current, {
        volume: isMuted ? 0 : 1,
      })
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 1 : 0)
      setIsMuted(!isMuted)
    }
  }

  const checklistItems = [
    'Filed Already?',
    'Denied or Underrated?',
    'Not Sure How to Start?',
  ]

  return (
    <header className="flex flex-col justify-center relative w-full h-full bg-[#F3F4F6] bg-cover bg-center p-0 pb-12 sm:p-0">
      <PromoBanner message="Black Friday Promo is Live! Free Intro Call with Jordan Anderson!" />
      <div className="flex flex-col justify-center items-center sm:items-start xl:w-[1440px] lg:flex-row relative h-fit lg:h-full mt-[53px] md:mt-[100px] mb-[0px] md:mb-[40px] sm:p-16 p-8 mx-auto">
        {/* Text Section */}
        <div className="flex flex-col lg:h-full w-full">
          <div className="flex flex-col mb-0 sm:mb-5 justify-center items-center sm:items-start">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-lexendDeca text-crimsonNew w-full text-center sm:text-left">
              VA Claims are Tough
            </h1>
            <h2 className="font-semibold text-oxfordBlue text-2xl sm:text-3xl md:text-4xl font-lexendDeca mb-5 text-center sm:text-left">
              We Make Them Easy
            </h2>
          </div>

          {/* CTA Button and Checkpoints */}
          <div className="flex flex-col justify-start items-start gap-L w-full sm:mt-2">
            <div className="hidden w-full sm:flex flex-col flex-wrap justify-start items-start gap-[10px] pl-5">
              {checklistItems.map((text, index) => (
                <span key={index} className="flex items-center gap-[10px]">
                  <Image
                    src={'/icons/VA_check_icon.svg'}
                    alt="check icon"
                    height={24}
                    width={22}
                    priority
                  />
                  <span className="text-lg font-medium text-black font-lexendDeca">
                    {text}
                  </span>
                </span>
              ))}
            </div>
            <Link href="/#pricing-section" legacyBehavior>
              <a className="hidden sm:flex cta-button font-bold text-xl text-white justify-center items-center gap-[15px] w-[300px] py-[15px] px-[20px] rounded-lg bg-crimsonNew hover:bg-[hsl(356,100%,20%)] active:bg-[hsl(356,100%,30%)] transition duration-300">
                Get Started
                <FontAwesomeIcon icon={faArrowRight} height={18} width={18} />
              </a>
            </Link>
          </div>
        </div>

        {/* Video Section */}
        <div className="flex flex-col lg:h-full w-full justify-start sm:justify-center items-start mt-[0px] lg:mt-[0px]">
          <div className="w-full min-w-[300px] sm:min-w-[380px] h-[300px] lg:h-[400px] mx-auto relative">
            <iframe
              ref={videoRef}
              title="vimeo-player"
              className="w-full h-full"
              src="https://player.vimeo.com/video/1020315337?h=5202f8ea3c&background=1&muted=1&cc_on=true"
              style={{ minWidth: '300px', minHeight: '200px' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
            <button
              className="absolute bottom-4 right-4 bg-white rounded-full p-2 z-10"
              onClick={toggleMute}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Mobile Checkpoints */}
        <div className="flex flex-col sm:hidden py-2 justify-center items-center gap-[10px] mb-5 w-full text-md font-medium text-black font-lexendDeca">
          {checklistItems.map((text, index) => (
            <span key={index} className="flex items-center gap-[4px]">
              <Image
                src={'/icons/VA_check_icon.svg'}
                alt="check icon"
                height={24}
                width={22}
                priority
              />
              <span className="text-lg">{text}</span>
            </span>
          ))}
        </div>

        <Link href="#pricing-section" legacyBehavior>
          <a className="sm:hidden cta-button flex justify-center items-center gap-[15px] w-[300px] py-[15px] px-[20px] rounded-lg bg-crimsonNew hover:bg-[hsl(356,100%,20%)] active:bg-[hsl(356,100%,30%)] transition duration-300 text-white font-bold text-sm">
            Get Started
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </Link>
      </div>

      {/* Review Scores and Angle Element */}
      <div className="block sm:hidden bg-white mt-5 w-full">
        <ReviewScores />
      </div>
      <AngleElement angleType="bottom-light-simple" fillColor="#FFF" />
    </header>
  )
}
