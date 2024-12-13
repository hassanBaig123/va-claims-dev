'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'

interface Course {
  id: number
  name: string
}

interface CourseWithUserData extends Course {
  id: any
  content?: {
    courseTitle?: string
    coursePreview?: string
    courseDescription?: string
    modules?: any
  }
  user_data?: {
    id?: string
    course_id?: string
    user_id?: string
    watched_videos?: Record<number, boolean>
  }
}

const useCourses = () => {
  const supabase = createClient()
  const { user } = useSupabaseUser()

  const [courses, setCourses] = useState<CourseWithUserData[] | null>(null)
  const [errors, setErrors] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (user) {
      const fetchCourses = async () => {
        const { data: userCourses, error: userCoursesError } = await supabase
          .from('user_courses')
          .select('*')
          .eq('user_id', user?.id)

        if (userCoursesError) {
          setErrors(userCoursesError)
          setCourses(null)
          return
        }

        if (userCourses) {
          const courseIds = userCourses?.map(
            (userCourse) => userCourse.course_id,
          )

          const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .in('id', courseIds)

          if (coursesError) {
            setErrors(coursesError)
            setCourses(null)
            return
          }

          if (coursesData) {
            const coursesWithUserData = coursesData?.map((course) => {
              const userCourseData = userCourses?.find(
                (userCourse) => userCourse?.course_id === course?.id,
              )
              return {
                ...course,
                user_data: userCourseData,
              }
            })

            setCourses(coursesWithUserData)
            setErrors(null)
          }
        }
      }
      fetchCourses()
    }
  }, [user])

  return { courses, errors }
}

export default useCourses
