import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextHome,
  CarouselPreviousHome,
} from '../ui/carousel'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import ReviewScores from '@/components/home/review-scores'
import AngleElement from '../angledesign'

const testimonials = [
  {
    id: 1,
    imageSrc: '/imgs/testimonials/Facebook USE FIRST.webp',
    alt: 'Facebook testimonial 1',
  },
  {
    id: 2,
    imageSrc: '/imgs/testimonials/Facebook4.webp',
    alt: 'Facebook testimonial 2',
  },
  {
    id: 3,
    imageSrc: '/imgs/testimonials/Facebook.webp',
    alt: 'Facebook testimonial 3',
  },
]

export default function SocialProofCarousel(props: {
  title?: string
  bgColor?: string
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section className="relative w-full flex flex-col items-center justify-center text-center overflow-visible bg-center px-L sm:px-XXL gap-XXL sm:gap-L pt-12 pb-28 bg-no-repeat bg-white">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-lexendDeca text-crimsonNew">
          {props.title || 'Proven Success For Veterans Like You'}
        </h1>
      </div>
      <div className="w-full max-w-[1440px] sm:mb-6">
        <div className="hidden sm:block ">
          <ReviewScores />
        </div>
        <Carousel
          className="flex flex-col gap-L mt-10"
          opts={{
            align: 'start',
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="-ml-4 md:flex md:flex-nowrap">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 lg:basis-1/3 lg:max-w-[33.333%]"
              >
                <Dialog
                  open={selectedImage === testimonial.imageSrc}
                  onOpenChange={(open) => !open && setSelectedImage(null)}
                >
                  <DialogTrigger asChild>
                    <div
                      className="w-full h-full flex items-center justify-center p-4 cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
                      style={{ maxHeight: '600px' }}
                      onClick={() => setSelectedImage(testimonial.imageSrc)}
                    >
                      <Image
                        src={testimonial.imageSrc}
                        alt={testimonial.alt}
                        width={500}
                        height={500}
                        className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300 ease-in-out"
                        style={{ maxHeight: '600px' }}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[50vw] max-h-[90vh] overflow-y-auto p-0">
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src={testimonial.imageSrc}
                        alt={testimonial.alt}
                        width={1000}
                        height={1000}
                        className="w-auto max-h-[85vh] object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center items-center gap-L mt-4 lg:hidden">
            <CarouselPreviousHome />
            <CarouselNextHome />
          </div>
        </Carousel>
      </div>
      <AngleElement angleType="bottom-light-simple" fillColor="#F3F4F6" />
    </section>
  )
}
