import { Review } from "@prisma/client";
import classNames from "classnames";
import React from "react";
import uzeStore from "../lib/store/store";
import { metresToKm, ratingEnumToString } from "../lib/util/review-utils";
import { ReviewWithDistance } from "./TownReviewsList";
import Button from "./ui/Button";
import Card from "./ui/Card";
import ViewOnMapButton from "./ViewOnMapButton";

export interface ReviewStubProps {
  review: ReviewWithDistance;
}

function ReviewStub({ review }: ReviewStubProps) {
  const { setCurrentReviewId } = uzeStore((state) => state.actions);
  return (
    <div className="flex flex-row gap-2 w-full ">
      <Button
        smallScale
        border="thin"
        outlineColor="stone"
        onClick={() => {
          setCurrentReviewId(review.id!);
        }}
        className="flex flex-col md:flex-row  w-full  md:justify-between p-8 gap-2"
      >
        <div className="flex flex-col gap-2 md:justify-start md:text-left w-full md:w-1/2">
          <span className="text-2xl line-clamp-1 pt-1 ">{review.title}</span>
          <div className="grid grid-cols-2  md:w-1/3 justify-start  items-center ">
            <span className="text-petal">{metresToKm(review.distance)} km</span>
            <span
              className={classNames("", {
                "text-emerald-600": review.rating === 3,

                "text-blue-600": review.rating === 2,
                "text-rose-600": review.rating === 1,
              })}
            >
              {ratingEnumToString(review.rating!)}
            </span>
          </div>
        </div>

        <div className="md:w-1/2 w-full h-full p-2">
          <span className="line-clamp-3 text-justify text-sm md:text-base">
            {review.body}
          </span>
        </div>
      </Button>
    </div>
  );
}

export default ReviewStub;
