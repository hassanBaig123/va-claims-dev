/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import getCourses from '../../../../components/courses/getCourses'
import { useRouter } from 'next/navigation'

const Courses = () => {
  const router = useRouter()
  const { courses } = getCourses()
  console.log('courses', courses)

  function countVideos(course: any): number {
    return course?.content?.modules?.reduce(
      (total: any, module: any) => (total += module?.videos?.length),
      0,
    )
  }

  const handleCourseClick = (
    course_id: string,
    moduleId: string,
    videoId: string,
  ) => {
    // console.log(course_id, videoId, moduleId);
    router.push(`/courses/${course_id}/${moduleId}/${videoId}`)
  }

  return (
    <div className="p-4">
      <div className="w-full flex justify-start items-center mb-6">
        <h1 className="text-2xl font-bold font-oswald">Courses</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses?.map((course) => (
          <div
            key={course.id}
            onClick={() =>
              handleCourseClick(
                course?.id,
                JSON.stringify(course?.content?.modules[0]?.moduleId),
                course?.content?.modules[0]?.videos[0]?.videoId,
              )
            }
            className="cursor-pointer border rounded-lg overflow-hidden shadow-md"
          >
            <div className="w-full flex justify-between items-center p-4  bg-blue-500">
              <div className=" text-white">VA Claims Academy</div>
              <div className=" text-white bg-green-400 rounded-l-full rounded-r-full p-2 flex justify-center items-center text-sm shadow-md uppercase font-bold">
                {course?.name}
              </div>
            </div>

            <img
              src={`${course?.content?.coursePreview}`}
              alt={'Course Preview'}
              className="w-full h-56 object-cover rounded-b-[50%]"
            />

            <div className="w-full flex justify-center items-center my-4">
              <h1 className="uppercase text-[19px] font-oswald font-normal text-center ">
                {course?.content?.courseTitle}
              </h1>
            </div>
            <div className="w-full flex justify-center items-center">
              <h1 className="text-base font-normal leading-normal text-center text-[#a4b8c3] my-0 mb-4">
                {countVideos(course)} Lessons
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
