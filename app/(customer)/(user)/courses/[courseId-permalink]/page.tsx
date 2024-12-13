import CourseModule from "@/components/courses/courseModule";

export default async function CourseContent({ params }: any) {
  

  const courseId = params["courseId-permalink"];

  return (
    <CourseModule
      courseId={courseId}
    />
  );
}
