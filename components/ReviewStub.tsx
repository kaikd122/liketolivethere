import { Review } from "@prisma/client";
import classNames from "classnames";
import React from "react";
import uzeStore from "../lib/store/store";
import { ratingEnumToString } from "../lib/util/review-utils";
import Button from "./ui/Button";

export interface ReviewStubProps {
  review: Partial<Review>;
}

function ReviewStub({ review }: ReviewStubProps) {
  const { setCurrentReviewId } = uzeStore((state) => state.actions);
  return (
    <Button
      className="flex flex-row  w-full justify-between p-4"
      smallScale
      outlineColor="stone"
      border="thin"
      onClick={() => setCurrentReviewId(review.id!)}
    >
      <div className="flex flex-col gap-2 justify-start text-left w-1/2">
        <span className="text-2xl line-clamp-1">{review.title}</span>
        <span
          className={classNames("w-1/4 justify-start", {
            "text-emerald-500": review.rating === 3,

            "text-blue-500": review.rating === 2,
            "text-red-500": review.rating === 1,
          })}
        >
          {ratingEnumToString(review.rating!)}
        </span>
      </div>

      <div className="w-1/2 text-justify text-base h-full">
        <span className="line-clamp-3">{review.body}</span>
      </div>
    </Button>
  );
}

export default ReviewStub;
