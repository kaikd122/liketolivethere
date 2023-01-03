import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Review, User } from "@prisma/client";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { deleteReviewCommand } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import { ratingEnumToString } from "../lib/util/review-utils";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Button from "./ui/Button";
import ViewOnMapButton from "./ViewOnMapButton";

export interface ReviewContentProps {
  review: Partial<Review>;
  user: Partial<User> | null;
  setReview?: React.Dispatch<React.SetStateAction<Review | null>>;
}

function ReviewContent({ review, user, setReview }: ReviewContentProps) {
  const {
    setCurrentReviewId,
    setEditReviewId,
    setCoordinates,
    setCurrentTab,
    setViewOnMapSource,
    setIsCreatingReview,
    setReviewFeatures,
    setReviewStubs,
    setMapViewSearchStatus,
  } = uzeStore((state) => state.actions);
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);
  const reviewStubs = uzeStore((state) => state.reviewStubs);
  const { user: currentUser } = uzeStore((state) => state);
  const currentTab = uzeStore((state) => state.currentTab);
  const [isDeleting, setIsDeleting] = useState(false);
  const reviewFeatures = uzeStore((state) => state.reviewFeatures);
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="flex flex-row justify-between items-start gap-2 w-full ">
        <div className="flex flex-col gap-3">
          <CoordinatesDisplay
            preText="Review at"
            className=" text-lg md:text-2xl gap-1 md:gap-2"
            iconSize="MEDIUM"
          />

          {currentTab !== "MAP" && (
            <div className="flex flex-row w-full justify-start items-center">
              <ViewOnMapButton
                withText
                coordinates={{
                  lat: Number(review.latitude),
                  lng: Number(review.longitude),
                }}
              />
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={() => {
            setCurrentReviewId("");
            setReview && setReview(null);
          }}
          outlineColor="red"
          className="flex flex-row gap-1 items-center justify-center "
          border="thin"
        >
          <XMarkIcon className="h-5 w-5 " />
          <p>Close</p>
        </Button>
      </div>
      <div className="gap-4 text-center items-center justify-center flex flex-col w-full md:w-10/12 break-words">
        <div className="text-3xl w-3/4">{review.title}</div>
        <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
          <div
            className={classNames("text-xl", {
              "text-emerald-600": review.rating === 3,
              "text-blue-600": review.rating === 2,
              "text-rose-600": review.rating === 1,
            })}
          >
            {ratingEnumToString(review.rating!)}
          </div>
          <p className="text-xl">Lived here in {review.lastLivedYear}</p>
        </div>
        <p className="text-sm whitespace-pre-line text-left pb-8 w-full font-light">
          {review.body}
        </p>
      </div>
      <div className="flex flex-col w-full items-start justify-center gap-2 text-sm">
        <p>
          Written by {user?.name} on{" "}
          {dayjs(review.createdAt).format("DD/MM/YYYY")}
        </p>

        {currentUser?.id && user?.id === currentUser?.id && (
          <div className="flex flex-row justify-between items-center w-full">
            <Button
              outlineColor="petal"
              border="thin"
              onClick={() => {
                setCoordinates({
                  lat: Number(review.latitude),
                  lng: Number(review.longitude),
                });
                setCurrentTab("MAP");
                setEditReviewId(review?.id || "");
                setIsCreatingReview(true);
                setCurrentReviewId("");

                setViewOnMapSource({
                  type: "WRITE",
                  id: review?.id!,
                });
                setMapViewSearchStatus("SEARCHED");
              }}
            >
              {isMapLoaded ? (
                <div className="flex flex-row gap-1 items-center justify-center">
                  <PencilSquareIcon className="w-5 h-5 items-center justify-center" />
                  <p>Edit review</p>
                </div>
              ) : (
                <Link href="/" className="flex flex-row gap-1">
                  <PencilSquareIcon className="w-5 h-5 " />
                  <p>Edit review</p>
                </Link>
              )}
            </Button>

            {isDeleting ? (
              <div className="flex flex-row gap-3">
                <Button
                  outlineColor="red"
                  border="thin"
                  onClick={async () => {
                    try {
                      const res = await deleteReviewCommand({ id: review.id! });
                      if (res) {
                        toast.success("Successfully deleted review!");
                        setReviewFeatures(
                          reviewFeatures.filter(
                            (feature) => feature.properties.id !== review.id
                          )
                        );
                        setReviewStubs(
                          reviewStubs.filter((stub) => stub.id !== review.id)
                        );

                        setCurrentReviewId("");
                        setReview && setReview(null);
                        setIsDeleting(false);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <div className="flex flex-row gap-1 justify-center items-center">
                    <TrashIcon className="w-5 h-5 items-center justify-center" />
                    <p>Confirm</p>
                  </div>
                </Button>

                <Button
                  outlineColor="stone"
                  border="thin"
                  onClick={() => setIsDeleting(false)}
                >
                  <p>Cancel</p>
                </Button>
              </div>
            ) : (
              <Button
                outlineColor="red"
                border="thin"
                onClick={() => setIsDeleting(true)}
              >
                <div className="flex flex-row gap-1 justify-center items-center">
                  <TrashIcon className="w-5 h-5 items-center justify-center" />
                  <p>Delete review</p>
                </div>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewContent;
