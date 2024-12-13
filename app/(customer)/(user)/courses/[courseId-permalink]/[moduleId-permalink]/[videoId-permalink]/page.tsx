import { Suspense } from 'react';
import CourseModule from "@/components/courses/courseModule";

export default async function CourseContent({ params }: any) {
  const courseId = params["courseId-permalink"];
  const moduleId = params["moduleId-permalink"];
  const videoId = params["videoId-permalink"];

  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
      <div className="w-full h-full">
        <CourseModule courseId={courseId} videoId={videoId} moduleId={moduleId} />
      </div>
    </Suspense>
  );
}
