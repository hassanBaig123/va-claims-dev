"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import Player from "@vimeo/player";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import getCourses from "./getCourses";
import updateWatchedVideo from "./updateWatched";
import "./CourseModule.css";

interface CourseModuleProps {
  courseId: string;
  videoId: string;
}

const CourseModule: React.FC<CourseModuleProps> = ({ courseId, videoId }) => {
  const { courses, errors } = getCourses();
  const router = useRouter();

  // Filter courses based on courseId
  const filteredCourse =
    courses?.find((course) => courseId === "all" || course.id === courseId) ??
    null;

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);
  let player: Player | null = null;

  // Calculate progress
  const watchedVideosCount = Object.values(
    filteredCourse?.user_data?.watched_videos ?? {}
  )?.filter((watched) => watched)?.length;

  const totalVideosCount = filteredCourse?.content?.videos?.length ?? 1;
  const progress =
    totalVideosCount === 0 ? 0 : (watchedVideosCount / totalVideosCount) * 100;

  const handleVideoWatched = async (videoId: string) => {
    const updatedData = await updateWatchedVideo(
      courseId,
      videoId,
      filteredCourse?.user_data?.user_id
    );
    if (updatedData) {
      console.log("Video marked as watched:", videoId);
    } else {
      console.error("Failed to mark video as watched");
    }
  };

  useEffect(() => {
    // Set the initial video based on the videoId prop
    if (videoId && filteredCourse?.content?.videos) {
      const initialVideoIndex = filteredCourse?.content?.videos?.findIndex(
        (video) => video?.videoId === videoId
      );
      if (initialVideoIndex !== -1) {
        setCurrentVideoIndex(initialVideoIndex);
      }
    }
  }, [videoId, filteredCourse]);

  useEffect(() => {
    const loadVimeoPlayer = async () => {
      if (
        !playerRef?.current ||
        !filteredCourse?.content?.videos?.[currentVideoIndex]
      )
        return;

      const { default: VimeoPlayer } = await import("@vimeo/player");

      if (player) {
        player.destroy();
      }

      player = new VimeoPlayer(playerRef.current, {
        url: `https://vimeo.com/${filteredCourse?.content?.videos[currentVideoIndex]?.videoId}`,
        // width: 800,
      });

      player.on("ended", () => {
        console.log("player finished");
        handleVideoWatched(
          filteredCourse?.content?.videos[currentVideoIndex]?.videoId
        );
        setCurrentVideoIndex(currentVideoIndex + 1);
      });
    };

    loadVimeoPlayer();

    return () => {
      if (player) {
        player.destroy();
        player = null;
      }
    };
  }, [currentVideoIndex, filteredCourse]);

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    const selectedVideoId = filteredCourse?.content?.videos?.[index]?.videoId;
    if (selectedVideoId) {
      router.push(`/courses/${courseId}/${selectedVideoId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <h2 className="w-full text-start text-[24px] font-[700] m-0 p-0">
        {filteredCourse?.content?.courseTitle || ""}
      </h2>
      <p className="w-full  text-start text-[14px] font-[400]m-0 p-0 ">
        {filteredCourse?.content?.courseDescription || ""}
      </p>

      {filteredCourse?.content?.videos?.length > 0 && (
        <>
          <div className="videoFlex">
            <ReactPlayer
              ref={playerRef}
              url={`https://vimeo.com/${videoId}`}
              width={"100%"}
              height={640}
              controls
            />
            <h3 className="w-full text-start mt-5 text-[16px] font-[700] ">
              {filteredCourse?.content?.videos?.[currentVideoIndex]?.title ||
                ""}
            </h3>
            <p className="w-full text-start mt-2 text-[14px] font-[400] ">
              {filteredCourse?.content?.videos?.[currentVideoIndex]
                ?.description || ""}
            </p>
          </div>

          <div className="w-full flex justify-between pr-5">
            <h4 className="w-full text-start text-[16px] font-[700] mt-5">
              Course Progress
            </h4>
            <p className="font-[12px] font-[400] min-w-max ">
              40% (4 watched out of 10)
            </p>
          </div>
          <Progress value={progress} className="w-full pr-5 mt-2" />

          <div className="w-full text-start text-[20px] font-[700] mt-5">
            <p>This Course Videos</p>
          </div>
          <Carousel
            opts={{ align: "start" }}
            className="w-[90%] px-5 md:px-0 mt-2"
          >
            <CarouselContent>
              {filteredCourse &&
                filteredCourse?.content?.videos?.map(
                  (video: any, index: any) => {
                    const isWatched =
                      filteredCourse?.user_data?.watched_videos?.[
                        video?.videoId
                      ];
                    return (
                      <CarouselItem
                        key={index}
                        className="sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
                      >
                        <div onClick={() => handleVideoSelect(index)}>
                          <Card
                            className="h-[95px] w-[170px]"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <img
                              className="h-[95px] w-[170px] object-contain"
                              src="https://cdn.pixabay.com/photo/2017/11/10/05/34/play-2935460_1280.png"
                              alt="media_icon"
                            />
                          </Card>
                          <div className="w-full mt-5">
                            <p className="font-[15px] font-[600]">
                              {video?.title}
                            </p>
                            <p className="font-[13px] font-[600] text-[#14242E9E]">
                              {isWatched ? "Watched" : "Not Watched"}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  }
                )}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext style={{ marginRight: "40px" }} />
          </Carousel>
        </>
      )}
    </div>
  );
};

export default CourseModule;
