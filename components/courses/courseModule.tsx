'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import getCourses from './getCourses'
import updateWatchedVideo from './updateWatched'
import './CourseModule.css'
import Image from 'next/image'
import { useVideoContext } from '@/context/course-context'
import { Button } from '../ui/button'
import { handleThumbnailUrl } from './helper'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface CourseModuleProps {
  courseId?: string
  videoId?: string
  moduleId?: string
}
enum LessonTypeEnum {
  VIDEO_TYPE = 'video',
  DOC_TYPE = 'docs',
  EXCEL_TYPE = 'excel',
  LINK_IMAGE_TYPE = 'link_image',
  LINK_TYPE = 'link',
  PDF_TYPE = 'pdf',
}

const CourseModule: React.FC<CourseModuleProps> = ({
  courseId,
  moduleId,
  videoId,
}) => {
  const router = useRouter()
  const { addWatchedVideoId, watchedVideoIds } = useVideoContext()
  const { courses, errors } = getCourses()

  const filteredCourse =
    courses?.find((course) => courseId === 'all' || course.id === courseId) ??
    null

  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0)
  const [currentModule, setCurrentModule] = useState<any>([])
  const [moduleVideos, setModuleVideos] = useState<any[]>([])
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [videoKey, setVideoKey] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const playerRef = useRef<any>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (filteredCourse && moduleId) {
      const moduleIndex = filteredCourse?.content?.modules?.findIndex(
        (module: any) => module.moduleId === moduleId,
      )
      if (moduleIndex !== -1) {
        setCurrentModuleIndex(moduleIndex)
        setCurrentModule(filteredCourse?.content?.modules[moduleIndex])
      }
    }
  }, [filteredCourse, moduleId])

  useEffect(() => {
    if (filteredCourse && moduleId) {
      const moduleIndex = filteredCourse?.content?.modules?.findIndex(
        (module: any) => JSON.stringify(module.moduleId) === moduleId,
      )
      if (moduleIndex !== -1) {
        setCurrentModuleIndex(moduleIndex)
      }
    }
  }, [moduleId, filteredCourse])

  useEffect(() => {
    const currentModule = filteredCourse?.content?.modules?.[currentModuleIndex]
    const moduleVideos = currentModule?.videos ?? []

    setModuleVideos(moduleVideos)

    if (moduleVideos?.length > 0) {
      setVideoUrl(moduleVideos[currentVideoIndex]?.url || '')
      setVideoKey((prevKey) => prevKey + 1)
    }
  }, [filteredCourse, currentModuleIndex, currentVideoIndex])

  const watchedVideosFromCourse = new Set(
    Object.entries(filteredCourse?.user_data?.watched_videos ?? {})
      .filter(([videoId, watched]) => watched)
      .map(([videoId]) => videoId),
  )

  const allWatchedVideosArray = Array.from(watchedVideosFromCourse)
  const allWatchedVideos = new Set([
    ...allWatchedVideosArray,
    ...watchedVideoIds,
  ])

  const watchedVideosInModule = moduleVideos.filter((video) =>
    allWatchedVideos.has(video.videoId),
  ).length

  const totalVideosCount = moduleVideos.length
  const progress =
    totalVideosCount === 0
      ? 0
      : (watchedVideosInModule / totalVideosCount) * 100

  const handleVideoWatched = async (videoId: string) => {
    await updateWatchedVideo(
      courseId || '',
      videoId,
      filteredCourse?.user_data?.user_id || '',
    )
    addWatchedVideoId(videoId)
  }

  useEffect(() => {
    if (videoId && moduleVideos.length > 0) {
      const initialVideoIndex = moduleVideos.findIndex(
        (video) => video?.videoId === videoId,
      )
      if (initialVideoIndex !== -1) {
        setCurrentVideoIndex(initialVideoIndex)
        setVideoUrl(moduleVideos[initialVideoIndex]?.url || '')
        setVideoKey((prevKey) => prevKey + 1)
      }
    }
  }, [videoId, moduleVideos, moduleId])

  const handleVideoSelect = (videoId: string) => {
    const requiredModule = filteredCourse?.content?.modules[currentModuleIndex]

    router.push(`/courses/${courseId}/${requiredModule?.moduleId}/${videoId}`)
  }

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank')
    handleVideoWatched(moduleVideos[currentVideoIndex]?.videoId)
  }

  const handleDownloadPdf = (url: string, extension: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `file.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    handleVideoWatched(moduleVideos[currentVideoIndex]?.videoId)
  }

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (isMobile && !hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem('hasSeenTutorial', 'true')
    }
  }, [])

  if (errors) {
    return <div>Error loading course</div>
  }

  if (!currentModule) {
    return <div>Loading module...</div>
  }

  return (
    <div
      className="flex flex-col items-center w-full px-4 md:px-8 md:overflow-y-auto md:scrollbar-hide md:h-screen"
      style={{ height: 'calc(100vh - 70px)' }}
    >
      <h2 className="w-full text-left text-2xl font-bold m-0 p-0">
        {currentModule?.moduleTitle || ''}
      </h2>
      <p className="w-full text-left text-sm font-light m-0 p-0">
        {currentModule?.description || ''}
      </p>
      {moduleVideos?.length > 0 && (
        <>
          {moduleVideos[currentVideoIndex]?.lessonType ===
            LessonTypeEnum.VIDEO_TYPE && (
            <div
              className={`aspect-video mt-4 relative rounded-lg overflow-hidden md:min-h-[300px] md:min-w-[500px] ${
                isLoading ? 'invisible' : 'visible'
              }`}
            >
              <ReactPlayer
                key={videoKey}
                ref={playerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                className="react-player"
                onReady={() => setIsLoading(false)}
                onEnded={() =>
                  handleVideoWatched(moduleVideos[currentVideoIndex]?.videoId)
                }
              />
            </div>
          )}
          {moduleVideos[currentVideoIndex]?.lessonType ===
            LessonTypeEnum.LINK_TYPE && (
            <div className="w-full aspect-video mt-4 relative flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden md:min-h-[300px] md:min-w-[500px]">
              <Button
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2"
                onClick={() =>
                  handleOpenLink(moduleVideos[currentVideoIndex]?.url)
                }
              >
                Open Link
              </Button>
            </div>
          )}
          {moduleVideos[currentVideoIndex]?.lessonType ===
            LessonTypeEnum.PDF_TYPE && (
            <div className="flex items-center justify-center gap-4 w-full aspect-video mt-4 relative bg-gray-900 rounded-lg overflow-hidden p-4 md:min-h-[300px] md:min-w-[500px]">
              <Button
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 w-fit"
                onClick={() =>
                  handleOpenLink(moduleVideos[currentVideoIndex]?.url)
                }
              >
                Open PDF
              </Button>
              <Button
                className="text-white bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 w-fit"
                onClick={() =>
                  handleDownloadPdf(moduleVideos[currentVideoIndex]?.url, 'pdf')
                }
              >
                Download PDF
              </Button>
            </div>
          )}
          {moduleVideos[currentVideoIndex]?.lessonType ===
            LessonTypeEnum.LINK_IMAGE_TYPE && (
            <div className="flex items-center justify-center gap-4 w-full aspect-video mt-4 relative bg-gray-900 rounded-lg overflow-hidden p-4 md:min-h-[300px] md:min-w-[500px]">
              <Button
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 w-fit"
                onClick={() =>
                  handleOpenLink(moduleVideos[currentVideoIndex]?.url)
                }
              >
                Open Link
              </Button>
              <Button
                className="text-white bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 w-fit"
                onClick={() =>
                  handleOpenLink(moduleVideos[currentVideoIndex]?.urlImage)
                }
              >
                Open Image
              </Button>
            </div>
          )}
          {moduleVideos[currentVideoIndex]?.lessonType ===
            LessonTypeEnum.EXCEL_TYPE && (
            <div className="flex items-center justify-center gap-4 w-full aspect-video mt-4 relative bg-gray-900 rounded-lg overflow-hidden p-4 md:min-h-[300px] md:min-w-[500px]">
              <Button
                className="text-white bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 w-fit"
                onClick={() =>
                  handleDownloadPdf(moduleVideos[currentVideoIndex]?.url, 'xls')
                }
              >
                Download XLSX File
              </Button>
            </div>
          )}
          {moduleVideos[currentVideoIndex]?.lessonType ===
            LessonTypeEnum.DOC_TYPE && (
            <div className="flex items-center justify-center gap-4 w-full aspect-video mt-4 relative bg-gray-900 rounded-lg overflow-hidden p-4 md:min-h-[300px] md:min-w-[500px]">
              <Button
                className="text-white bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 w-fit"
                onClick={() =>
                  handleDownloadPdf(
                    moduleVideos[currentVideoIndex]?.url,
                    'docx',
                  )
                }
              >
                Download DOC File
              </Button>
            </div>
          )}

          <h3 className="w-full text-left mt-4 text-lg font-semibold">
            {moduleVideos[currentVideoIndex]?.videoTitle || ''}
          </h3>
          <p className="w-full text-left mt-1 text-sm font-light">
            {moduleVideos[currentVideoIndex]?.description || ''}
          </p>

          <div className="w-full flex justify-between items-center mt-5">
            <h4 className="text-lg font-semibold">Module Progress</h4>
            <p className="text-sm font-light">
              {progress.toFixed(0)}% ({watchedVideosInModule} watched out of{' '}
              {totalVideosCount})
            </p>
          </div>
          <Progress value={progress} className="w-full mt-1" />

          <h4 className="w-full text-left mt-5 text-lg font-semibold">
            This Module's Videos
          </h4>
          <Carousel className="w-full mt-2">
            <CarouselContent>
              {moduleVideos?.map((video: any, index: number) => {
                const isWatched = allWatchedVideos.has(video?.videoId || '')
                const lessonType = video?.lessonType
                return (
                  <CarouselItem
                    key={index}
                    className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <div onClick={() => handleVideoSelect(video?.videoId)}>
                      <Card className="h-36 w-36 flex flex-col items-center justify-center cursor-pointer">
                        {lessonType === LessonTypeEnum.VIDEO_TYPE ? (
                          <Image
                            src={handleThumbnailUrl(video?.url) || ''}
                            alt={`Thumbnail ${index}`}
                            height={100}
                            width={100}
                            className="h-full w-full object-contain"
                          />
                        ) : lessonType === LessonTypeEnum.LINK_TYPE ? (
                          <Image
                            className="h-10 w-10 object-contain"
                            src={'/icons/link-02-stroke-rounded.svg'}
                            alt={video?.videoTitle || 'Link thumbnail'}
                            height={100}
                            width={100}
                          />
                        ) : lessonType === LessonTypeEnum.LINK_IMAGE_TYPE ? (
                          <Image
                            className="h-10 w-10 object-contain"
                            src={'/icons/image-02-stroke-rounded.svg'}
                            alt={video?.videoTitle || 'Link thumbnail'}
                            height={100}
                            width={100}
                          />
                        ) : lessonType === LessonTypeEnum.PDF_TYPE ? (
                          <Image
                            className="h-10 w-10 object-contain"
                            src={'/icons/pdf-02-stroke-rounded.svg'}
                            alt={video?.videoTitle || 'PDF thumbnail'}
                            height={100}
                            width={100}
                          />
                        ) : lessonType === LessonTypeEnum.EXCEL_TYPE ? (
                          <Image
                            className="h-10 w-10 object-contain"
                            src={'/icons/xls-02-stroke-rounded.svg'}
                            alt={video?.videoTitle || 'EXCEL thumbnail'}
                            height={100}
                            width={100}
                          />
                        ) : lessonType === LessonTypeEnum.DOC_TYPE ? (
                          <Image
                            className="h-10 w-10 object-contain"
                            src={'/icons/doc-02-stroke-rounded.svg'}
                            alt={video?.videoTitle || 'DOC thumbnail'}
                            height={100}
                            width={100}
                          />
                        ) : null}
                      </Card>
                      <div className="w-40 mt-2 text-start">
                        <p className="text-sm font-semibold">
                          {video?.videoTitle}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            isWatched ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {isWatched ? 'Watched' : 'Not Watched'}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="ml-16 sm:ml-4" />
            <CarouselNext className="mr-16 sm:mr-4 " />
          </Carousel>
        </>
      )}
      {showTutorial && (
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome!</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Tap on the <strong>Modules</strong> button to view all course
              modules and videos.
            </DialogDescription>
            <DialogFooter>
              <button
                onClick={() => setShowTutorial(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Got it!
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default CourseModule
