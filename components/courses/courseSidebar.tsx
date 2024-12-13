"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import getCourses from "./getCourses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import "./CourseModule.css";

export function CourseSidebarNav({ className, ...props }) {
  const { courses, errors } = getCourses();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (pathname.includes("courses/all/1") || courses?.length > 0) {
      setExpanded(courses && `item-${courses[0]?.id}`);
    }
  }, [pathname, courses]);

  if (errors) {
    return <div>Error loading courses</div>;
  }

  return (
    <nav
      className={cn(
        "flex w-[260px] space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      <p className="text-[14px] font-500 text-[#7E8598] my-2">My Courses</p>
      {courses &&
        courses?.map((item) => {
          return (
            <Accordion
              type="single"
              collapsible
              key={item?.id}
              value={expanded}
              onValueChange={(value) => {
                setExpanded(value);
              }}
              className="accordion-container"
            >
              <AccordionItem
                value={`item-${item?.id}`}
                className="accordion-item"
              >
                <AccordionTrigger className="accordion-trigger ">
                  {item?.content?.courseTitle}
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <ul className="list-decimal pl-2 ">
                    {item?.content?.videos?.map((video, index) => {
                      const isWatched =
                        item?.user_data?.watched_videos?.[video?.videoId];
                      return (
                        <li
                          key={video?.videoId}
                          className=" mt-2 mb-5 flex justify-between "
                        >
                          <Link
                            href={`/courses/${item?.id}/${video?.videoId}`}
                            className={`underline-hover-side font-[11px] ${
                              !isWatched && "text-[#7E8598]"
                            }`}
                          >
                            <span className="m-0 p-0 mr-1">{index + 1}.</span>
                            <span>{video?.title}</span>
                          </Link>
                          {isWatched && (
                            <FontAwesomeIcon icon={faCircleCheck} />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
    </nav>
  );
}
