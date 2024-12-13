'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons'
import { useVideoContext } from '@/context/course-context'
import getCourses from './getCourses'
import { Button } from '@/components/ui/button'

interface Video {
  videoId: string
  videoTitle: string
}

interface Module {
  moduleId: string
  moduleTitle: string
  videos: Video[]
}

interface Course {
  id: string
  content: {
    courseTitle: string
    modules: Module[]
  }
  user_data?: {
    watched_videos?: Record<string, boolean>
  }
}

const MobileCourseView: React.FC = () => {
  const { watchedVideoIds } = useVideoContext()
  const params = useParams()
  const { courses, errors } = getCourses()
  const router = useRouter()
  const [expandedModule, setExpandedModule] = useState<string | undefined>(
    undefined,
  )
  const [isContentVisible, setIsContentVisible] = useState(false)

  const filteredCourse = courses?.find(
    (course) => course?.id === (params?.['courseId-permalink'] as string),
  ) as Course | undefined

  const handleVideoClick = (
    courseId: string,
    moduleId: string,
    videoId: string,
  ) => {
    router.push(`/courses/${courseId}/${moduleId}/${videoId}`)
  }

  if (errors) {
    return <div className="p-4 text-red-500">Error loading courses</div>
  }

  if (!filteredCourse) {
    return <div className="p-4">No course found</div>
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="bg-oxfordBlueNew text-white p-4">
        <h1 className="text-xl font-bold mb-4">
          {filteredCourse.content.courseTitle}
        </h1>
        <Button
          onClick={() => setIsContentVisible(!isContentVisible)}
          className={`w-full text-md font-semibold transition-colors duration-300 ${
            isContentVisible
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isContentVisible
            ? 'Hide Course Content ↑'
            : 'View Course Content and Materials ↓'}
        </Button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isContentVisible ? 'opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="overflow-y-auto flex-grow">
          {filteredCourse.content.modules.map((module, index) => (
            <Accordion
              key={module.moduleId}
              type="single"
              collapsible
              value={expandedModule}
              onValueChange={(value) =>
                setExpandedModule(value as string | undefined)
              }
            >
              <AccordionItem value={module.moduleId} className="border-b">
                <AccordionTrigger className="flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <span className="font-semibold">{`Module ${index + 1}: ${
                    module.moduleTitle
                  }`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-none p-0">
                    {module.videos.map((video, videoIndex) => {
                      const isWatched =
                        filteredCourse.user_data?.watched_videos?.[
                          video.videoId
                        ] || watchedVideoIds.includes(video.videoId)
                      return (
                        <li
                          key={video.videoId}
                          className={`p-4 border-b hover:bg-gray-50 transition-colors duration-200 ${
                            params?.['videoId-permalink'] === video.videoId
                              ? 'bg-blue-100'
                              : ''
                          }`}
                          onClick={() =>
                            handleVideoClick(
                              filteredCourse.id,
                              module.moduleId,
                              video.videoId,
                            )
                          }
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              <span className="font-medium mr-2">{`${
                                videoIndex + 1
                              }.`}</span>
                              {video.videoTitle}
                            </span>
                            {isWatched && (
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="text-green-500"
                              />
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileCourseView
