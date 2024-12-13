import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/pro-light-svg-icons";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { getUserCourses } from '@/utils/users/courseUtils';
import { cn } from '@/utils';

interface TodoCoursesRowProps {
  tier: 'gold' | 'silver' | 'bronze' | 'upgrade_bronze_to_silver' | 'upgrade_bronze_to_gold' | 'upgrade_silver_to_gold' | 'one_time_pay_test' | 'grandmaster' | 'master' | 'expert' | 'upgrade_expert_to_master' | 'upgrade_master_to_grandmaster' | 'upgrade_expert_to_grandmaster';
  userId: string;
  displayMessage: string;
}

interface Video {
  videoId: string;
  videoTitle: string;
}

interface Module {
  moduleId: number;
  videos: Video[];
}

const TodoCoursesRow: React.FC<TodoCoursesRowProps> = async ({ tier, userId, displayMessage }) => {
  let processedCourses;
  try {
    processedCourses = await getUserCourses(userId);
    
    // If no courses are available, don't render the component
    if (processedCourses.length === 0) {
      return null;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return null; // Don't show the component if there's an error
  }

  const getNextVideoLink = (course: any) => {
    if (!course.nextUnwatchedVideo) return null;

    const courseModule = course.content.modules.find((m: Module) => 
      m.videos.some((v: Video) => v.videoId === course.nextUnwatchedVideo.videoId)
    );

    if (!courseModule) return null;

    return `/courses/${course.id}/${courseModule.moduleId}/${course.nextUnwatchedVideo.videoId}`;
  };

  return (
    <AccordionItem value="courses">
      <AccordionTrigger className={cn("hover:bg-slate-100 min-h-[10rem] sm:min-h-7")}>
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 md:w-7 md:h-7 mr-2" />
            <span className="w-full md:w-auto text-lg font-light">
              {displayMessage}
              <span className="text-sm ml-4 text-amber-500 todo-requirement">
                Recommended
              </span>
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6">
          {processedCourses.map((course) => {
            const nextVideoLink = getNextVideoLink(course);
            return (
              <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{course.courseTitle}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.courseDescription}</p>
                <div className="flex items-center mb-2">
                  <Progress value={course.progress} className="w-full mr-4" />
                  <span className="text-sm font-medium">{Math.round(course.progress)}% Complete</span>
                </div>
                {nextVideoLink && (
                  <Link 
                    href={nextVideoLink}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Next: {course.nextUnwatchedVideo?.videoTitle}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TodoCoursesRow;