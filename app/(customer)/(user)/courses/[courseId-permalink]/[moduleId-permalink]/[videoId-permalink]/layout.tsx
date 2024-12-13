import React from "react";
import { Metadata } from "next";
import { CourseSidebarNav } from "@/components/courses/courseSidebar";
import { VideoProvider } from "@/context/course-context";
import MobileCourseView from "@/components/courses/mobileCourseView";

export const metadata: Metadata = {
  title: "Course Content",
  description: "View your course content and track your progress.",
};

interface CourseLayoutProps {
  children: React.ReactNode;
}

const CourseLayout: React.FC<CourseLayoutProps> = ({ children }) => {
  return (
    <VideoProvider>
      <div className="h-full overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:space-x-12 lg:pb-0 lg:min-h-[calc(100vh-70px)]">
          <aside className="hidden lg:block w-full lg:w-1/4 px-5 bg-gray-100 dark:bg-gray-800">
            <CourseSidebarNav />
          </aside>
          <div className="lg:hidden h-full">
            <MobileCourseView />
          </div>
          <main className="flex-1 p-5 lg:pl-0 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </VideoProvider>
  );
};

export default CourseLayout;