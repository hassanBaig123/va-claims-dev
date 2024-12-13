import React from 'react';
import { TypographyH1 } from "@/components/report/h1"
import { TypographyH2 } from "@/components/report/h2"
import  DisplayImages  from "@/components/report/images"

const CoverPage = () => {
  return (

    <div className="print:flex print:flex-col print:min-h-screen print:justify-between hidden -mt-40 mb-72 relative"  style={{pageBreakBefore: 'always'}}>

      
      <div className="print:flex print:flex-col print:items-center print:justify-center print:flex-grow relative right">
        <TypographyH1 className="print:text-center print:mb-10">Your VetVictory Claim Guide</TypographyH1>
      <DisplayImages
        imagePath="/imgs/Logo/VA_Claims_Main_Logo_Multicolor_Transparent_960px.png"
        altText="VA Claims Academy"
        width={250}
        height={250}
      />
        {/* <TypographyH1 className="pb-5">VA Claims</TypographyH1>
        <TypographyH1>Academy</TypographyH1> */}
      </div>
    </div>


    );
};

export default CoverPage;