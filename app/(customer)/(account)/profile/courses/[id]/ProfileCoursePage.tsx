'use client'
import { Separator } from '@/components/ui/separator'
import { User } from '@/types/supabase.tables'
import { ProfilePageContextProvider } from '@/context/ProfilePageContext'
import { Button } from '@/components/ui/button'
import CourseCard from './course-card'
import {
  getUserAllCourses,
  removeCourseFromUserCourses,
} from '@/utils/users/user-courses'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'
import Loading from '@/components/global/loading'
import AddCourseDialog from './add-course-dialog'

export default function ProfileCoursePage({ user }: { user: User }) {
  const [allCourses, setallCourses] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getCourses = async () => {
    try {
      setLoading(true)
      const courseData = await getUserAllCourses(user?.id)
      setallCourses(courseData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCourses()
  }, [])

  const refreshCourses = () => {
    getCourses()
  }

  const [removeLoading, setRemoveLoading] = useState(false)

  const handleRemoveCourse = async (courseId: any) => {
    setRemoveLoading(true)
    try {
      // Remove the course from the database (example query)
      const response = await removeCourseFromUserCourses(user?.id, courseId)
      refreshCourses()
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setRemoveLoading(false)
    }
  }

  return (
    <ProfilePageContextProvider user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Courses</h3>
          <AddCourseDialog userId={user?.id} refreshData={refreshCourses}>
            <Button
              className="truncate text-white rounded-lg p-4 flex justify-center items-center text-sm shadow-md"
              variant={'black'}
            >
              Add New Course
            </Button>
          </AddCourseDialog>
        </div>
        <Separator />

        {loading && (
          <div className="flex justify-center items-center">
            <Loading /> is Loading...
          </div>
        )}

        {!loading && (
          <div className="flex gap-5 flex-wrap">
            {Array.isArray(allCourses) && allCourses.length > 0 ? (
              allCourses.map((course: any) => (
                <CourseCard
                  key={course?.id}
                  course={course}
                  userId={user?.id}
                  onRemove={() => handleRemoveCourse(course?.id)}
                  loading={removeLoading}
                />
              ))
            ) : (
              <div className="truncate text-sm font-medium">
                No Course found.
              </div>
            )}
          </div>
        )}
      </div>
    </ProfilePageContextProvider>
  )
}
