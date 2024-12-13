import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faUsers } from "@fortawesome/pro-light-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from '@/utils';

const TodoJoinBoardroom: React.FC = () => {
  return (
    <AccordionItem value="board-room">
    <AccordionTrigger className={cn("hover:bg-slate-100 min-h-[10rem] sm:min-h-7")}>
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex w-full md:w-auto items-center">
            <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 md:w-7 md:h-7 mr-2" />
            <span className="w-full md:w-auto text-lg font-light">
              Join the Board Room on Facebook
              <span className="text-xs md:text-sm ml-4 text-amber-500 todo-requirement">
                Recommended
              </span>
            </span>
          </div>
        </div>
      </AccordionTrigger>
    <AccordionContent className="flex justify-center ">
      <div className="flex w-full items center sm:w-10/12 md:w-9/12">
        <p className="text-lg text-gray-700 mt-4 px-6 py-2">
          Join an <strong>exclusive</strong> community of veterans and
          experts where you can share experiences, ask questions, and
          receive support throughout your VA claims process.
        </p>
        <a
          href="https://www.facebook.com/share/g/Pid5UrH93DvikHq9/?mibextid=K35XfP"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center hover:bg-blue-100 transition-colors rounded-lg mt-10 sm:mt-0"
        >
          <Image
            src="/imgs/join-boardroom-facebook.png"
            alt="Facebook"
            width={400}
            height={119}
          />
        </a>
      </div>
    </AccordionContent>
  </AccordionItem>
  );
};

export default TodoJoinBoardroom;