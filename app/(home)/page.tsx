import { JSX, SVGProps } from "react"
import SocialProof from "@/components/home/socialproof"
import Hero from "@/components/home/hero"
import { NavigationMenuDemo } from "@/components/home/navmenu"
import LowerTierFeatures from "@/components/home/lowertierfeatures"
import Footer from "@/components/home/footer"
import { FAQ } from "@/components/home/faq"
import Promo from "@/components/home/promo"
import BlogList from "@/components/home/latestblogposts"
import Disclaimer from "@/components/home/disclaimer"
import PremiumServices from "@/components/home/premiumservices"
import { MobileCTA } from "@/components/home/mobilecta"
import { ClearpointReport } from "@/components/home/clearpointreport"
import LearnMore from "@/components/home/learnmore"
import SocialLinks from "@/components/home/sociallinks"
import ReviewScores from "@/components/home/review-scores"
import Problems from "@/components/home/problems"
import Benefits from "@/components/home/benefits"
import Features from "@/components/home/landingfeatures"
import StickyCTA from "@/components/home/stickycta"
import ClearPathShort from "@/components/home/clearpathshort"
import NexusShort from "@/components/home/nexusshort"
import PersonalStatementShort from "@/components/home/personalstatementshort"
import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";

export default function Home() {
  return (
       
      <div className="flex-auto">
        <Hero />
        {/* Trustpilot Score */}
        <ReviewScores/>

        <SocialProof />
        <Problems />
        <Benefits />
        <Features />
        <StickyCTA />
        <ClearPathShort />
        <NexusShort />
        <PersonalStatementShort />
        {/* <LowerTierFeatures />
        <PremiumServices />
        <ClearpointReport />
        <MobileCTA />
        <Promo /> */}
        <FAQ />
        {/* <BlogList />
        <Disclaimer /> */}
        <LearnMore />
        <SocialLinks />
        <Footer isHomePage={true} />
        
      </div>
  )
}