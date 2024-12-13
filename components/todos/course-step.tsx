import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'

import { getUserCourses, ProcessedCourse } from '@/utils/users/courseUtils'
import Image from 'next/image'
import fblogo from '../../public/icons/fb-logo.svg'
import { getCourseStatus } from '@/utils/users/course-status'

interface TodoCoursesRowProps {
  tier:
    | 'gold'
    | 'silver'
    | 'bronze'
    | 'upgrade_bronze_to_silver'
    | 'upgrade_bronze_to_gold'
    | 'upgrade_silver_to_gold'
    | 'one_time_pay_test'
    | 'grandmaster'
    | 'master'
    | 'expert'
    | 'upgrade_expert_to_master'
    | 'upgrade_master_to_grandmaster'
    | 'upgrade_expert_to_grandmaster'
  userId: string
  displayMessage: string
  hasPurchase: boolean
}

interface Video {
  videoId: string
  videoTitle: string
  url: string
  lessonType: string
  description: string
}

interface Module {
  moduleId: number
  videos: Video[]
}

interface CourseContent {
  modules: Module[]
  courseId: string
  courseTitle: string
  coursePreview: string
  courseDescription: string
}

interface DisplayCourse {
  id: string
  name: string
  courseId: string
  courseTitle: string
  courseDescription: string
  coursePreview: string
  progress: number
  nextUnwatchedVideo: Video
  content: CourseContent
}

const CoursesStep: React.FC<TodoCoursesRowProps> = async ({
  tier,
  userId,
  hasPurchase,
  displayMessage,
}) => {
  let displayCourse: ProcessedCourse
  let processedCourses
  try {
    processedCourses = await getUserCourses(userId)
    const filteredCourse = processedCourses.find(
      (course: ProcessedCourse) => course?.name === 'VA Claims Academy',
    )
    // If "VA Claims Academy" course is not available, use the first course
    displayCourse = filteredCourse || processedCourses[0]
    // If no courses are available, don't render the component
    if (!displayCourse) {
      return null
    }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return null // Don't show the component if there's an error
  }

  const getNextVideoLink = (course: any) => {
    if (!course.nextUnwatchedVideo) return null

    const courseModule = course.content.modules.find((m: Module) =>
      m.videos.some(
        (v: Video) => v.videoId === course.nextUnwatchedVideo.videoId,
      ),
    )

    if (!courseModule) return null

    return `/courses/${course.id}/${courseModule.moduleId}/${course.nextUnwatchedVideo.videoId}`
  }

  return (
    <div className="upperRightWrapper">
      <div className="upperRight">
        <div className="rightWhite">
          <p className="completeText">Complete your Training</p>
        </div>
        <div className="rightGradient">
          <Link
            href={getNextVideoLink(displayCourse) || '#'}
            style={{
              width: '100%',
            }}
          >
            <div className="gradientUpper">
              <div className="leftText">
                <p className="courseHeading">{displayCourse.name}</p>
              </div>
              <div className="value">
                <p className="progressValue">
                  {+(displayCourse?.progress || 0).toFixed(0)}%
                </p>
                <p className="progressStatus">
                  {getCourseStatus(displayCourse?.progress)}
                </p>
              </div>
            </div>
            <div className="progress-bar mt-5" style={containerStyles}>
              <div style={fillerStyles(displayCourse.progress)} />
            </div>
          </Link>
          {processedCourses.length > 1 && (
            <div className="viewAllDiv">
              <Link href={'/courses'}>
                <span className="viewAllText">View All Courses</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {tier && hasPurchase && (
        <a
          className="joinFb"
          href="https://www.facebook.com/share/g/Pid5UrH93DvikHq9/?mibextid=K35XfP"
          target="_blank"
          rel="noopener noreferrer"
          // className="flex items-center justify-center hover:bg-blue-100 transition-colors rounded-lg mt-10 sm:mt-0"
        >
          <Image src={fblogo} alt={'fblogo'} />
          <p>Join our Exclusive Community on Facebook</p>
        </a>
      )}
    </div>
  )
}

export default CoursesStep

const containerStyles = {
  height: 10,
  width: '100%',
  backgroundColor: '#d0d2d9',
  borderRadius: 50,
}

const fillerStyles: (progress: number) => React.CSSProperties = (progress) => ({
  height: '100%',
  width: `${progress}%`,
  backgroundColor: '#00B67A',
  borderRadius: 'inherit',
  textAlign: 'right',
})

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  const truncated = text.slice(0, maxLength)
  return truncated.slice(0, truncated.lastIndexOf(' ')) + '...'
}

// <AccordionItem value="courses">
//       <AccordionTrigger
//         className={cn('hover:bg-slate-100 min-h-[10rem] sm:min-h-7')}
//       >
//         <div className="flex w-full justify-between flex-wrap">
//           <div className="flex items-center">
//             <FontAwesomeIcon
//               icon={faGraduationCap}
//               className="w-4 h-4 md:w-7 md:h-7 mr-2"
//             />
//             <span className="w-full md:w-auto text-lg font-light">
//               {displayMessage}
//               <span className="text-sm ml-4 text-amber-500 todo-requirement">
//                 Recommended
//               </span>
//             </span>
//           </div>
//         </div>
//       </AccordionTrigger>
//       <AccordionContent>
//         <div className="space-y-6">
//           {processedCourses.map((course) => {
//             const nextVideoLink = getNextVideoLink(course)
//             return (
//               <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-2">
//                   {course.courseTitle}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {course.courseDescription}
//                 </p>
//                 <div className="flex items-center mb-2">
//                   <Progress value={course.progress} className="w-full mr-4" />
//                   <span className="text-sm font-medium">
//                     {Math.round(course.progress)}% Complete
//                   </span>
//                 </div>
//                 {nextVideoLink && (
//                   <Link
//                     href={nextVideoLink}
//                     className="text-blue-600 hover:underline text-sm"
//                   >
//                     Next: {course.nextUnwatchedVideo?.videoTitle}
//                   </Link>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </AccordionContent>
//     </AccordionItem>
