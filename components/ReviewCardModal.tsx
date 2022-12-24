import { Review, User } from "@prisma/client";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getReviewByIdRequest } from "../lib/actions/review";
import { getUserRequest } from "../lib/actions/user";
import uzeStore from "../lib/store/store";
import { ratingEnumToString } from "../lib/util/review-utils";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Modal from "./ui/Modal";
import dayjs from "dayjs";

function ReviewCardModal() {
  const currentReviewId = uzeStore((state) => state.currentReviewId);
  const { setCurrentReviewId } = uzeStore((state) => state.actions);
  const [review, setReview] = useState<Review | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const main = async () => {
      try {
        const reviewRes = await getReviewByIdRequest({
          data: { id: currentReviewId },
        });
        const review = await reviewRes.json();
        setReview(review);
        const userRes = await getUserRequest({
          userId: review?.userId,
        });
        const user = await userRes.json();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentReviewId) {
      main();
    }
  }, [currentReviewId]);
  if (!currentReviewId) {
    return null;
  }

  if (!review) {
    return <div>Loading...</div>;
  }
  return (
    <Modal
      onClick={() => {
        setCurrentReviewId("");
        setReview(null);
      }}
    >
      <Card className="shadow-lg">
        <div className="flex flex-col gap-6 w-full items-center">
          <div className="flex flex-row justify-between items-start gap-2 w-full ">
            <div className="flex flex-col gap-2">
              <CoordinatesDisplay
                preText="Review at"
                className=" text-lg md:text-2xl gap-1 md:gap-2"
              />
              <p>
                Written by {user?.name} on{" "}
                {dayjs(review.createdAt).format("DD/MM/YYYY")}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                setCurrentReviewId("");
                setReview(null);
              }}
              outlineColor="red"
              className=" "
              border="thin"
            >
              Close
            </Button>
          </div>
          <div className="gap-4 text-center items-center justify-center flex flex-col w-full md:w-10/12 ">
            <div className="text-3xl w-3/4">{review.title}</div>
            <div
              className={classNames("text-xl", {
                "text-emerald-500": review.rating === 3,
                "text-blue-500": review.rating === 2,
                "text-rose-500": review.rating === 1,
              })}
            >
              {ratingEnumToString(review.rating!)}
            </div>
            <p className="text-sm whitespace-pre-line text-left pb-8">
              {review.body}
            </p>
          </div>
        </div>
      </Card>
    </Modal>
  );
}

export default ReviewCardModal;
