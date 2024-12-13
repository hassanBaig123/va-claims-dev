'use client'
import { SunIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '../ui/card'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export default function LowerTierFeatures() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const scrollSnaps = emblaApi ? emblaApi.scrollSnapList() : []

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi])

  const onSelect = () => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ) as any
  return (
    <div className="w-full flex flex-col items-center mt-10 gap-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text">
        Free Resources
      </h2>
      <Carousel className="w-full" plugins={[plugin.current]}>
        <CarouselContent className="mb-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <CarouselItem className="basis-full" key={i}>
              <Card className="border-0">
                <CardContent className="flex flex-col items-center justify-center h-80">
                  <div className="p-2 rounded-full">
                    <SunIcon className=" h-6 w-6 mb-2 opacity-75" />
                  </div>
                  <h2 className="text-xl font-bold ">Inbox Zero</h2>
                  <p className="">
                    Inbox Zero is a rigorous approach to email management aimed
                    at keeping the inbox empty.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="dots z-20">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === selectedIndex ? 'is-selected' : ''}`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
