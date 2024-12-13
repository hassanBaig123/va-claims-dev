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
      <header className="flex justify-center relative w-full h-[90px] md:h-[250px] xl:h-[250px] bg-[url('/imgs/brand_patterns/VA_Claims_Stars_Screen_Size_Landscape_Filled_1_Pattern.png')] bg-cover bg-center header-bg-overlay border-none-important">
       
        
          <AngleElement angleType="bottom-light-simple" />
      </header>
    </>
  );
}
