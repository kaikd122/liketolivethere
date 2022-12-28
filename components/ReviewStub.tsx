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
      <Card className="flex flex-col md:flex-row  w-full  md:justify-between p-4 gap-2">
        <div className="flex flex-col gap-2 md:justify-start md:text-left w-full md:w-1/2">
          <span className="text-xl md:text-2xl line-clamp-1">
            {review.title}
          </span>
          <div className="grid grid-cols-3  md:w-2/3 justify-start items-center ">
            <span>{metresToKm(review.distance)} km</span>
            <span
              className={classNames("", {
                "text-emerald-500": review.rating === 3,

                "text-blue-500": review.rating === 2,
                "text-red-500": review.rating === 1,
              })}
            >
              {ratingEnumToString(review.rating!)}
            </span>
            <div className="flex flex-row items-center justify-center  ">
              <Button
                className="text-sm p-1"
                outlineColor="petal"
                border="thin"
                onClick={() => setCurrentReviewId(review.id!)}
              >
                Open review
              </Button>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 w-full h-full">
          <span className="line-clamp-3 text-justify text-sm md:text-base">
            {review.body}
          </span>
        </div>
      </Card>
    </div>
  );
}

export default ReviewStub;
