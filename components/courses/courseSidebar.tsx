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

interface CourseSidebarNavProps {
  className?: string
}

export function CourseSidebarNav({ className }: CourseSidebarNavProps) {
  const { watchedVideoIds } = useVideoContext()
  const params = useParams()
  const { courses, errors } = getCourses()
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)

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
    // setCurrentModuleId(moduleId)
    // setCurrentVideoId(videoId)
    router.push(`/courses/${courseId}/${moduleId}/${videoId}`)
  }

  if (errors) {
    return <div>Error loading courses</div>
  }

  return (
    <nav
      className={cn(
        'flex flex-col w-full p-4 space-y-2 sc overflow-y-auto',
        className,
      )}
      style={{ maxHeight: 'calc(100vh - 70px)' }}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {filteredCourses?.content?.courseTitle}
      </p>
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
  )
}
