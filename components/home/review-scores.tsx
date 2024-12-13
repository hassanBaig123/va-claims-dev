import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { faStarHalfStroke, faStar } from "@fortawesome/sharp-solid-svg-icons";
import Image from "next/image";

const StarRating = ({ score }: { score: number }) => {
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center space-x-2">
      {Array(fullStars).fill(
        <FontAwesomeIcon icon={faStar} className="h-8 w-8 text-yellow-400" />
      )}
      {halfStar === 1 && (
        <FontAwesomeIcon
          icon={faStarHalfStroke}
          className="h-8 w-8 text-yellow-400"
        />
      )}
      {Array(emptyStars).fill(
        <FontAwesomeIcon icon={faStar} className="h-8 w-8 text-yellow-400" />
      )}
    </div>
  );
};

const ReviewScore = ({
  score,
  img,
  name,
}: {
  score: number;
  img: string;
  name: string;
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-3 w-full">
      <Image
        className="flex mb-3 sm:max-h-24 md:max-h-32 max-h-10 place-self-start"
        src={img}
        alt={name}
        width={128}
        height={128}
      />
      <StarRating score={score} />
      <span className="text-5xl font-extrabold">{score}</span>
    </div>
  );
};

export default function ReviewScores() {
  return (
    <section className="w-full h-fit">
      <div className="flex flex-col justify-center text-center ">
        <div className="trustpilot-widget" data-locale="en-US" data-template-id="53aa8807dec7e10d38f59f32" data-businessunit-id="652ae48e8860e2ce4e38d94f" data-style-height="120px" data-style-width="100%" data-theme="light">
        </div>
      </div>
    </section>
  );
}
