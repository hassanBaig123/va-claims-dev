"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointRight } from "@fortawesome/pro-duotone-svg-icons";
import { faCircleX, faArrowRight } from "@fortawesome/pro-duotone-svg-icons";
import { faPlay } from "@fortawesome/pro-duotone-svg-icons";
import React, { useState } from "react";
import Link from "next/link"; // Import Link from next/link instead of lucide-react

export default function Hero() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Event handler to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to close the modal if the click is outside the video container
  const handleClose = (e: React.SyntheticEvent) => {
    if ((e.target as HTMLElement).id === "modalBackground") {
      setIsModalOpen(false);
    }
  };

  const VideoModal = () => (
    <div
      id="modalBackground" // Add an ID to reference in the click event
      className={`fixed inset-0 bg-black w-full bg-opacity-50 z-50 flex justify-center items-center ${
        isModalOpen ? "" : "hidden"
      }`}
      onClick={handleClose} // Add the click event listener
      onTouchEnd={handleClose}
    >
      <div className="w-11/12 h-10/12 flex justify-center items-center relative">
        <iframe
          src="https://player.vimeo.com/video/941409981?"
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
        {/* Close button */}
        <button
          onClick={() => setIsModalOpen(false)} // Keep this to allow closing by button
          className="absolute top-10 left-10 text-3xl cursor-pointer"
        >
          <FontAwesomeIcon icon={faCircleX} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="flex justify-center relative w-full md:h-[700px] xl:h-[750px] bg-[url('/imgs/brand_patterns/VA_Claims_Stars_Screen_Size_Landscape_Filled_1_Pattern.png')] bg-cover bg-center header-bg-overlay border-none-important">
        <div className="absolute bottom-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#fff" d="M0,320 L1440,240 L1440,320 L0,320 Z"></path>
          </svg>
        </div>

        {/* <div data-negative="false" className="visuals-shape visuals-shape-bottom visuals-shape-bottom-ltr">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path className="visuals-shape-fill" d="M0,6V0h1000v100L0,6z"></path>
          </svg>       
        </div> */}
        <div className="flex flex-col justify-center items-center mt-4 xl:w-[1400px] gap-4 md:flex-row relative h-full">
          <div className="flex flex-col sm:h-full justify-start sm:justify-center items-center sm:mt-14  p-3 sm:p-7  w-full sm:w-7/12">
            <div id="hero-statement-container" className="mt-20 sm:mt-0 w-full">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-crimson text-center md:text-left w-full">
                VA CLAIMS ARE CONFUSING.
              </h1>
              <h2 className="font-bold text-oxfordBlue sm:mt-5  mt-1 text-lg md:text-3xl lg:text-3xl text-center md:text-left">
                We're Here To Make It Easy.
              </h2>
            </div>
            <div
              id="mobile-view-hero-items"
              className="hidden md:flex flex-col justify-center w-full"
            >
              <div
                id="now-serving-container"
                className="flex flex-col items-start mt-6 space-x-2 w-full"
              >
                <div className="text-2xl font-semibold my-4 text-oxfordBlue">
                  Now Serving:
                </div>
                <div className="flex justify-start gap-5 w-full xl:w-7/12">
                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 text-grey-500 mr-2"
                      fill="currentColor"
                      stroke="currentColor" // Add stroke with the same color as the fill
                      strokeWidth="2" // Increase the stroke width
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Active Duty</span>
                  </span>

                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 text-grey-500 mr-2"
                      fill="currentColor"
                      stroke="currentColor" // Add stroke with the same color as the fill
                      strokeWidth="2" // Increase the stroke width
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Veterans</span>
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 text-grey-500 mr-2"
                      fill="currentColor"
                      stroke="currentColor" // Add stroke with the same color as the fill
                      strokeWidth="2" // Increase the stroke width
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Guard & Reservists</span>
                  </span>
                </div>
              </div>

              <Link id="get-started-cta" href="/learn-more" legacyBehavior>
                <a className="cta-button text-xl mt-6 flex justify-center items-center w-72 font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
                  Get Started
                  <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-black"
                    />
                  </span>
                </a>
              </Link>
            </div>
          </div>
          <div
            id="vsl-container"
            className="flex flex-col sm:h-full w-full md:w-5/12 justify-start sm:justify-center items-start"
          >
            <div className="aspect-w-16 aspect-h-9 w-full  max-w-[670px] min-w-[400px] sm:min-w-[380px] h-full mx-auto">
              <iframe
                title="vimeo-player"
                className="w-full h-full"
                src="https://player.vimeo.com/video/876743399?h=5202f8ea3c"
                style={{
                  minWidth: "380px", // Set your desired minimum width here
                  minHeight: "212px", // Set your desired minimum height here
                  width: "100%",
                  height: "100%",
                }}
                allowFullScreen
              ></iframe>
            </div>
            <div
              id="mobile-view-hero-items"
              className="flex flex-col h-full justify-center items-center w-full md:hidden"
            >
              <div
                id="now-serving-container"
                className="flex flex-col items-center mt-4 space-x-2 w-full"
              >
                <div className="text-2xl font-semibold my-4 text-oxfordBlue">
                  Now Serving:
                </div>
                <div className="flex justify-around w-full">
                  <span className="flex items-center">
                    <svg
                     className="w-6 h-6 text-grey-500 mr-2"
                     fill="currentColor"
                     stroke="currentColor" // Add stroke with the same color as the fill
                     strokeWidth="1" // Increase the stroke width
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Active Duty</span>
                  </span>

                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 text-grey-500"
                      fill="currentColor"
                      stroke="currentColor" // Add stroke with the same color as the fill
                      strokeWidth="1" // Increase the stroke width
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Veterans</span>
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 text-grey-500 mr-2"
                      fill="currentColor"
                      stroke="currentColor" // Add stroke with the same color as the fill
                      strokeWidth="1" // Increase the stroke width                      
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Guard & Reservists</span>
                  </span>
                </div>
              </div>

              <Link id="get-started-cta" href="/learn-more#pricing-section" legacyBehavior>
                <a className="cta-button text-xl mt-5 flex text-center justify-center items-center w-72 font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_0px_#e6b00f,_0px_0px_0px_0px_#c3c3c3] hover:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded">
                  Get Started
                  <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition hover:translate-x-1">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-black"
                    />
                  </span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
