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
import { XMarkIcon } from "@heroicons/react/24/solid";
import ReviewContent from "./ReviewContent";
import { BeatLoader } from "react-spinners";

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
    return null;
  }
  return (
    <Modal
      onClick={() => {
        setCurrentReviewId("");
        setReview(null);
      }}
    >
      <Card className="shadow-lg rounded-lg">
        <ReviewContent review={review} user={user} setReview={setReview} />
      </Card>
    </Modal>
  );
}

export default ReviewCardModal;
