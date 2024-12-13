
'use client'
import { JSX, SVGProps } from "react"
import React, { useRef, useEffect } from "react";
import("@lottiefiles/lottie-player");
import { LottieInteractivity } from '@lottiefiles/lottie-interactivity';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, faEnvelopeOpenText, faBullseyePointer, faArrowRight } from "@fortawesome/pro-duotone-svg-icons";
import FadeInOnView from "@/components/fadeInOnView";


export default function Features() {
  const ref = useRef(null);
  useEffect(() => {
    import('@lottiefiles/lottie-interactivity').then(LottieInteractivity => {
      LottieInteractivity.create({
        player:'#lottieBadgeCheck',
              mode:"scroll",
              actions: [
                {
                  visibility: [0.20, 1.0],
                  type: "playOnce"
                }
              ]
      });
    }).catch(error => console.error("Failed to load LottieInteractivity", error));
  }, []);


  return (  
      
    <section className="w-full py-32 border-y-2 shiny-overlay-background">

      <div className="container">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-wide sm:text-5xl xl:text-6xl/none mb-4 relative sm:right-[-45px]">
                WIN YOUR VA RATING<span className="w-100vw sm:w-[95px] sm:h-[95px]"><lottie-player
                  id="lottieBadgeCheck"
                  ref={ref}
                  autoplay
                  mode="scroll"
                  src="/lottie/badgeCheck.json"                
                  style={{ width: "90px", height: "90px", display: "inline-block", position: "relative", top: "15px" }}
                ></lottie-player>
                </span>
              </h1>
              <h2 className="max-w-[600px] mx-auto text-3xl">
                Time to work smart, not hard.
              </h2>
            </div>
            
            <div className="w-full max-w-full mt-10 mx-auto flex flex-row items-center justify-evenly gap-10 flex-wrap sm:flex-nowrap">
              
            <FadeInOnView delay="0">
                <div className="flex flex-col items-center p-1 h-full align-center ">
                  <div className="p-3 rounded-full bg-crimson text-white animate-fade-up">
                    <FontAwesomeIcon icon={faUserGraduate} className="w-12 h-12"/>                  
                  </div>
                  <h2 className="text-2xl font-bold text-crimson mt-5">Curated VA Education</h2>
                  <p className="my-7 bg-zinc-100 rounded-lg p-10 min-h-64 text-lg text-start shadow-md">
                  Dive into our comprehensive course designed to demystify the VA claim process, empowering you with the knowledge to navigate your claim with confidence.
                  </p>
                </div>
                </FadeInOnView>
                <FadeInOnView delay="500ms">
                <div className="flex flex-col items-center p-1 h-full align-center">
                  <div className="p-3 rounded-full bg-crimson text-white">
                    <FontAwesomeIcon icon={faEnvelopeOpenText} className="w-12 h-12"/>
                  </div>
                  <h2 className="text-2xl font-bold text-crimson mt-5">Expert Document Prep</h2>
                  <p className="my-7 bg-zinc-100 rounded-lg p-10 min-h-64 text-lg text-start shadow-md">
                  Leverage our expertise in crafting compelling nexus letters and personal statements, tailored to highlight the strengths of your claim for maximum impact.
                  </p>
                </div>
                </FadeInOnView>
                <FadeInOnView delay="1000ms">
                <div className="flex flex-col items-center p-1 h-full align-center">
                  <div className="p-3 rounded-full bg-crimson text-white">
                  <FontAwesomeIcon icon={faBullseyePointer} className="w-12 h-12"/>
                  </div>
                  <h2 className="text-2xl font-bold text-crimson mt-5">Tailored Claim Strategy</h2>
                  <p className="my-7 bg-zinc-100 rounded-lg p-10 min-h-64 text-lg text-start shadow-md">
                  Benefit from personalized guidance to develop a robust claim strategy, ensuring you're positioned to secure the best possible outcome for your VA disability claim.
                  </p>
                </div>
                </FadeInOnView>
              
            </div>
          </div>
        
      </div>
    </section>
  )
}