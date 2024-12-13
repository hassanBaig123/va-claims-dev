'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import getCourses from './getCourses'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons'
import './CourseModule.css'
import { ModuleInterface, VideoInterface } from './types'
import { useVideoContext } from '@/context/course-context'
import { Cross1Icon } from '@radix-ui/react-icons'
import { ArrowRightIcon } from 'lucide-react'

interface MobileCourseSidebarNavProps {
  className?: string
}

export function MobileCourseSidebarNav({
  className,
}: MobileCourseSidebarNavProps) {
  const { watchedVideoIds } = useVideoContext()
  const params = useParams()
  const { courses, errors } = getCourses()
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filteredCourses: any | null =
    courses?.find(
      (course: any) => course?.id === params?.['courseId-permalink'],
    ) || null

  useEffect(() => {
    if (filteredCourses) {
      const moduleInPath = filteredCourses.content.modules.find(
        (module: ModuleInterface) => pathname.includes(module?.moduleId),
      )
      if (moduleInPath) {
        setExpanded(moduleInPath.moduleId)
      } else if (filteredCourses.content.modules.length > 0) {
        setExpanded(filteredCourses.content.modules[0].moduleId)
      }
    }
  }, [pathname, filteredCourses])

  const handleVideoClick = (
    courseId: string,
    moduleId: string,
    videoId: string,
  ) => {
    router.push(`/courses/${courseId}/${moduleId}/${videoId}`)
  }

  if (errors) {
    return <div>Error loading courses</div>
  }

  return (
    <div className="relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={`absolute top-1 sm:top-4 left-4 z-50 bg-oxfordBlueNew text-white p-1 sm:p-2 rounded ${
          isSidebarOpen ? 'hidden' : 'block'
        }`}
      >
        <ArrowRightIcon />
      </button>

      <nav
        className={cn(
          'flex flex-col w-full p-4 space-y-2 sc overflow-y-auto scrollbar-hide',
          className,
        )}
        style={{
          maxHeight: 'calc(100vh - 70px)',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'white',
          zIndex: 40,
        }}
      >
        <div className="w-full flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {filteredCourses?.content?.courseTitle}
          </p>

          <div className="pr-2" onClick={() => setIsSidebarOpen(false)}>
            <Cross1Icon />
          </div>
        </div>
        {filteredCourses?.content?.modules?.map((item: ModuleInterface) => (
          <Accordion
            key={item.moduleId}
            type="single"
            collapsible
            value={expanded || ''}
            onValueChange={(value) => setExpanded(value)}
            className="accordion-container"
          >
            <AccordionItem
              value={item.moduleId}
              className="accordion-item border-b dark:border-gray-700"
            >
              <AccordionTrigger className="accordion-trigger text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
                {item.moduleTitle}
              </AccordionTrigger>
              <AccordionContent className="accordion-content overflow-y-auto">
                <ul className="list-none pl-0">
                  {item?.videos?.map((video: VideoInterface, index: number) => {
                    const isWatched =
                      filteredCourses?.user_data?.watched_videos?.[
                        video?.videoId || ''
                      ] || watchedVideoIds.includes(video?.videoId || '')
                    return (
                      <li
                        key={video.videoId}
                        className={`mt-2 mb-4 flex justify-between items-center `}
                      >
                        <a
                          onClick={() =>
                            handleVideoClick(
                              filteredCourses?.id,
                              item?.moduleId,
                              video?.videoId || '',
                            )
                          }
                          className={`cursor-pointer text-sm text-gray-600 dark:text-gray-400
                            }`}
                        >
                          <span className="mr-2">{index + 1}.</span>
                          <span
                            className={`underline-hover-side ${
                              video?.videoId === params?.['videoId-permalink']
                                ? 'text-black font-semibold'
                                : ''
                            }`}
                          >
                            {video?.videoTitle}
                          </span>
                        </a>
                        {isWatched && (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-green-500"
                          />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </nav>
    </div>
  )
}
