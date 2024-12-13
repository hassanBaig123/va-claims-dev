import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LearnMoreHero from "@/components/learn-more/learnmorehero";
import ClearPathLong from "@/components/learn-more/clearpathlong";
import ReviewScores from "@/components/home/review-scores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FadeInOnView from "@/components/fadeInOnView";
import {
} from "@fortawesome/pro-solid-svg-icons";
import { createClient } from '@/utils/supabase/server';
import Footer from "@/components/home/footer";
import ClearPathLongWhite from "@/components/learn-more/clearpathwhite";
import NexusLong from "@/components/learn-more/nexuslong";
import PersonalStatementLong from "@/components/learn-more/personalstatementlong";
import PersonalStatementLongWhite from "@/components/learn-more/personalstatementlongwhite";
import NexusLongLight from "@/components/learn-more/nexuslonglight";
import Guarantee from "@/components/learn-more/guarantee";
import PriceAnchor from "@/components/learn-more/priceanchor";
import { FAQLong } from "@/components/learn-more/faqlong";
import PriceAnchorLight from "@/components/learn-more/priceanchorlight";
import Pricing from "@/components/learn-more/pricing";
import AdditionalPurchaseSection from "@/components/learn-more/additionalpurchasesection";
import SignupDialog from "@/components/learn-more/signuptest";

const LearnMorePage = async () => {

  const supabase = createClient();

  
  return (
    <div className="flex flex-col items-center justify-around">
      {/* Hero Section */}
      <LearnMoreHero />
       {/* <ClearPathLong /> */}
      <ClearPathLongWhite />
      {/* <NexusLong /> */}
      <NexusLongLight />
      <PersonalStatementLongWhite />
      {/* <PersonalStatementLong /> */}
      <FAQLong />
      {/* <PriceAnchor /> */}
      <PriceAnchorLight />
      <SignupDialog />
      <Pricing />
      <AdditionalPurchaseSection />
      <Guarantee />
      <Footer />

     


      

      
    </div>
  );
};

export default LearnMorePage;