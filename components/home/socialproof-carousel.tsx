import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBadgeCheck,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/pro-duotone-svg-icons";
import Image from "next/image"; // Step 1: Import the Image component
import FadeInOnView from "../fadeInOnView";

const testimonials = [
  {
    headline: "From 10 to 100% P&T after 3 months!!!",
    quote: "From 10 to 100% P&T after 3 months!!! – I decided in November to give the VA another shot after getting demoralized when I got out of the Marines in 2007. Back then I applied for hearing, tinnitus, shoulder and knee. I was awarded 10% for my shoulder and rejected when I appealed. I had no idea what I was doing when I applied. I started researching and kept seeing Jordan’s videos...on every angle. Like most combat vets, I’ve dealt with poor sleep, tough memories and anxiety ...",
    reviewerName: "Matthew Heerwald",
    rated: 4.7,
    numberOfReviews: 91,
  },
  {
    headline: "VA Claims Academy is the best.",
    quote: "VA Claims Academy is the best. – After taking Mr. Jordan class I have learned a lot. The class that he teaches are very easy to follow. if you just listen to what is being said you will be ok. I went from 0% to 40%, after trying for eight years. I ...",
    reviewerName: "Terry Henry",
    rated: 4.7,
    numberOfReviews: 91,
  },
  {
    headline: "From 60% to 80% and Climbing",
    quote: "I'm grateful for the re-education knowledge at my fingertips! Just started and have increased from 60% to 80% and climbing. Wasted a lot of time dealing with a Company that slow walks plus overpriced for services! Appreciate the support ...",
    reviewerName: "Calvin White",
    rated: 4.7,
    numberOfReviews: 91,
  },
 
];

export default function SocialProofCarousel() {
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true); // Step 1: State to control autoplay
  const autoplayPluginRef = useRef(
    Autoplay({ delay: 3000, jump: false, stopOnInteraction: true })
  );

  // Function to toggle autoplay
  const toggleAutoplay = () => setIsAutoplayEnabled(!isAutoplayEnabled);

  return (
    <section className="w-full flex flex-col items-center justify-center text-center overflow-y-visible mb-10 bg-center">      
      <div className="p-2 ">
        
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center align-bottom text-crimson leading-20">
          Thousands of Happy Clients Served
        </h1>
        
      </div>
      <div className="w-9/12 sm:w-10/12 xl:w-8/12 2xl:w-7/12">
      <Carousel className="flex items-center justify-center">
          <CarouselContent className="pb-5 mt-10">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 flex items-stretch">
                <div className="flex flex-col justify-between relative bg-[url('/imgs/brand_patterns/VA_Claims_Stars_A4_Filled_3_Pattern.png')] bg-cover rounded-lg text-white ">              
              
                    <h2 className="text-lg sm:text-2xl text-center pt-3">“{testimonial.headline}”</h2>
                    <blockquote className="text-left p-6">{testimonial.quote}</blockquote>
                    <div className="flex flex-col justify-start items-start mx-6 mb-4">
                      <div className="flex items-center mb-1">
                        <Image src="/imgs/stars-5.svg" alt="5-star rating" width={150} height={18} />
                      </div>
                      <span className="font-bold">by {testimonial.reviewerName}</span>
                    </div>              
                  <div className="bg-gray-800 p-2 flex justify-between items-center rounded-b-lg">
                    <span className="text-xs">Rated {testimonial.rated} / 5 | {testimonial.numberOfReviews} reviews</span>
                    <div className="flex items-center">
                      <Image src="/imgs/Trustpilot/Trustpilot_brandmark_gr-wht_RGB.svg" alt="Trustpilot" width={80} height={80} />
                    </div>
                  </div>
              
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="lg:hidden"/>
          <CarouselNext className="lg:hidden"/>
        </Carousel>
      </div>       
    </section>
  );
}
