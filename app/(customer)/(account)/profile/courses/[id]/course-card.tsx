'use client'
import { User } from '@/types/supabase.tables'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { countVideos } from '@/utils/users/count-videos'
import ConfirmationDialog from '@/components/confirmation-dialog/confirmation-dialog'
import './course-styles.css'
import { getCourseStatus } from '@/utils/users/course-status'

interface Content {
  modules: any
  courseId: string
  courseTitle: string
  coursePreview: string
  courseDescription: string
}

interface UserData {
  id: string
  user_id: string
  course_id: string
  watched_videos: string[] | null
}

interface Course {
  id: string
  name: string
  content: Content
  product_id: string
  created_at: string
  updated_at: string
  user_data: UserData
  courseDescription: string
  progress: number
}

interface CourseCardProps {
  course: Course
  userId: string
  onRemove: any
  loading: boolean
}

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

export default function CourseCard({
  course,
  userId,
  onRemove,
  loading,
}: CourseCardProps) {
  return (
    <>
      <Card className="w-full md:w-[300px] lg:w-[360px] xl:w-[400px] overflow-hidden bg-[#dedee04d]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-10  p-4 text-black">
          <CardTitle className="truncate text-md font-medium text-[19px]">
            {course?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-wrap text-md font-medium text-[12px] text-[#787878db] mb-4">
            {course?.courseDescription?.length > 200
              ? course?.courseDescription?.slice(0, 200) + '...'
              : course?.courseDescription}
          </div>
          {/* <img
            src={`${course?.content?.coursePreview}`}
            alt={'Course Preview'}
            className="w-full h-24 object-cover"
          /> */}

          <div className="value">
            <p className="progressValue">
              {+(course?.progress || 0).toFixed(0)}%
            </p>
            <p className="progressStatus">
              {getCourseStatus(course?.progress)}
            </p>
          </div>

          <div className="progress-bar my-2" style={containerStyles}>
            <div style={fillerStyles(course?.progress)} />
          </div>

          <ConfirmationDialog onRemove={onRemove} loading={loading}>
            <Button
              className="truncate w-full text-white p-4 md:p-2 flex justify-center items-center text-sm shadow-md font-medium mt-6 bg-red-500"
              variant={'destructive'}
            >
              Remove Course
            </Button>
          </ConfirmationDialog>
        </CardContent>
      </Card>
    </>
  )
  //   return (
  //     <>
  //       <Card className="md:min-w-[350px] overflow-hidden">
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-10  text-white">
  //           <CardTitle className="truncate text-md font-medium">
  //             VA Claims Academy
  //           </CardTitle>
  //           <ConfirmationDialog onRemove={onRemove} loading={loading}>
  //             <Button className="truncate text-white bg-green-400 rounded-l-full rounded-r-full p-4 md:p-2 flex justify-center items-center text-sm shadow-md uppercase font-bold">
  //               Remove
  //             </Button>
  //           </ConfirmationDialog>
  //         </CardHeader>
  //         <CardContent className="p-0">
  //           <img
  //             src={`${course?.content?.coursePreview}`}
  //             alt={'Course Preview'}
  //             className="w-full h-44 object-cover rounded-b-[50%]"
  //           />

  //           <div className="w-full flex justify-center items-center my-4">
  //             <h1 className="uppercase text-[19px] font-oswald font-normal text-center ">
  //               {course?.name}
  //             </h1>
  //           </div>
  //           <div className="w-full flex justify-center items-center">
  //             <h1 className="text-base font-normal leading-normal text-center text-[#a4b8c3] my-0 mb-4">
  //               {countVideos(course)} Lessons
  //             </h1>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </>
  //   )
}
