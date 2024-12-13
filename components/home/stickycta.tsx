'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-duotone-svg-icons";

const StickyCTA = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // New visibility state
  const ctaRef = useRef<HTMLDivElement | null>(null); // Ref to track the CTA DOM element

  // Define an offset value (in pixels)
  const offset = 300; // Adjust this value based on your needs

  const handleScroll = () => {
    if (!ctaRef.current) return;

    const ctaPosition = ctaRef.current.getBoundingClientRect().top + window.scrollY - offset; // Adjust position by offset
    const scrollPosition = window.scrollY + window.innerHeight;
    if (scrollPosition >= ctaPosition) {
      setIsSticky(true);
      setIsVisible(true); // Make the component visible earlier
    } else {
      setIsSticky(false);
      setIsVisible(false); // Optionally hide it again when scrolling up
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
        ref={ctaRef} 
        className={`${isSticky ? 'fixed bottom-0 left-0 w-full translate-y-0' : 'relative translate-y-full'} ${isVisible ? 'opacity-100' : 'opacity-0'} py-4 z-50 transition-all duration-500 ease-out`}
        style={{
            backgroundColor: '#0b1739c2', // Adjust the color and opacity as needed
        }}
        >
  <div className="max-w-screen-lg mx-auto flex justify-center">
    <Link href="/learn-more#pricing-section" legacyBehavior>
      <a className="cta-button text-xl sm:text-3xl flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-10 py-1 sm:py-5 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
        Get Started
        <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
          <FontAwesomeIcon icon={faArrowRight} className="text-black" />
        </span>
      </a>
    </Link>
  </div>
</div>
  );
};

export default StickyCTA;
