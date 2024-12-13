'use client'
import { SVGProps } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import SocialProofCarousel from "./socialproof-carousel"
import ReviewScores from "./review-scores"

export default function SocialProof() {

    
      
    return (
        <SocialProofCarousel />    
    )
  }