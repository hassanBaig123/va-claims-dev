import CourseModule from "@/components/courses/courseModule";

export default async function CourseContent({ params }) {
  const courseId = params["courseId-permalink"];
  const videoId = params["videoId-permalink"];

  return <CourseModule courseId={courseId} videoId={videoId} />;
}
