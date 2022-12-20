import { Review } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { getReviewByIdRequest } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Button from "./ui/Button";
import Card from "./ui/Card";

function ReviewCard() {
  const reviewId = uzeStore((state) => state.currentReviewId);
  const [review, setReview] = useState<Review | null>(null);
  useEffect(() => {
    const main = async () => {
      try {
        const reviewRes = await getReviewByIdRequest({
          data: { id: reviewId },
        });
        const review = await reviewRes.json();
        setReview(review);
      } catch (error) {
        console.log(error);
      }
    };

    if (reviewId) {
      main();
    }
  }, [reviewId]);
  if (!review) {
    return <div>Loading</div>;
  }
  return (
    <Card>
      <div className="flex flex-row justify-between items-start gap-2 w-full p-2">
        <div className="flex flex-col gap-2">
          <CoordinatesDisplay
            preText="Review at"
            className=" text-xl md:text-2xl gap-2"
          />
          <p className="text-sm italic">Positive review</p>
        </div>
        <Button
          type="button"
          onClick={() => {}}
          outlineColor="red"
          className=" "
          border="thin"
        >
          Close
        </Button>
      </div>
    </Card>
  );
}

export default ReviewCard;
