import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTvRetro, faCirclePlay } from "@fortawesome/pro-light-svg-icons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from '@/utils';

const TodoIntroVideo: React.FC = () => {
  return (
    <AccordionItem value="intro-video">
      <AccordionTrigger className={cn("hover:bg-slate-100 min-h-[10rem] sm:min-h-7")}>
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex w-full md:w-auto items-center">
            <FontAwesomeIcon icon={faTvRetro} className="w-4 h-4 md:w-7 md:h-7 mr-2" />
            <span className="w-full md:w-auto text-lg font-light">
              Watch an Introductory Video
              <span className="text-xs md:text-sm ml-4 text-amber-500 todo-requirement">
                Recommended
              </span>
            </span>
          </div>
          {/* <div className="flex items-center text-blue-600 mr-6">
            <span className="mr-3">Not Watched</span>
            <FontAwesomeIcon icon={faCirclePlay} className="w-7 h-7 ml-2" />
          </div> */}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-md text-gray-700 mt-4 px-6 py-2">
          Welcome to VA Claims Academy! We highly recommend you start by
          watching our introductory video. This video will guide you through the
          process of using our services, what you can expect going forward, and
          provide you with helpful tips to maximize the benefits of this service
          as well as your claim with the VA.
        </p>
        <div className="flex justify-end">
          <Link
            href="https://player.vimeo.com/video/880886271"
            target="_blank"
	          rel="noopener noreferrer"
            className={`${buttonVariants({
              variant: "outline",
            })} mt-4 bg-blue-700 text-white mr-5`}
          >
            Watch Video
          </Link>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TodoIntroVideo;