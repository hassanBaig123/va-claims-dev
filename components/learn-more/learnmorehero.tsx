"use client";

import React, { useState } from "react";
import AngleElement from "@/components/angledesign";

export default function LearnMoreHero() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Event handler to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to close the modal if the click is outside the video container
  const handleClose = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modalBackground") {
      setIsModalOpen(false);
    }
  };

  
  return (
    <>
      <header className="flex justify-center relative w-full md:h-[400px] xl:h-[450px] bg-[url('/imgs/brand_patterns/VA_Claims_Stars_Screen_Size_Landscape_Filled_1_Pattern.png')] bg-cover bg-center header-bg-overlay border-none-important">
       
        <div className="flex flex-col justify-center items-center pt-40 pb-24 xl:pt-16 xl:pb-16 xl:w-[1400px] gap-4 md:flex-row relative h-full">
          <div className="flex flex-col sm:h-full justify-start sm:justify-center items-center w-full">
            <div id="hero-statement-container" className="w-full">
              <h1 className="text-5xl md:text-6xl font-bold text-crimson text-center w-full">
                A Deeper Look
              </h1>              
            </div>
            
          </div>
          </div>
          <AngleElement angleType="bottom-light-simple" />
      </header>
    </>
  );
}
