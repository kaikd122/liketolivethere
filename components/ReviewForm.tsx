import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createReviewCommand,
  getReviewByIdRequest,
  getReviewsWithinMapBoundsRequest,
  updateReviewCommand,
} from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Button from "./ui/Button";
import Card from "./ui/Card";
import cuid from "cuid";
import { bounds } from "leaflet";
import { Review } from "@prisma/client";
import { reviewsToFeatures } from "../lib/util/review-utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import AuthButton from "./AuthButton";

type FormData = {
  body: string;
  title: string;
  lastLivedYear: number;
};

function ReviewForm() {
  const coordinates = uzeStore((state) => state.coordinates);
  const user = uzeStore((state) => state.user);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { setIsCreatingReview, setCurrentReviewId } = uzeStore(
    (state) => state.actions
  );
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState<number | undefined>(undefined);
  const bounds = uzeStore((state) => state.bounds);
  const editReviewId = uzeStore((state) => state.editReviewId);
  const {
    setEditReviewId,
    setIsWhatToWriteModalOpen,
    setReviewFeatures,
    setMapViewSearchStatus,
  } = uzeStore((state) => state.actions);

  const [reviewLength, setReviewLength] = useState(0);

  const onSubmit = async (data: FormData) => {
    let isInvalid = false;
    const errors: string[] = [];
    if (!data.body) {
      errors.push("review");

      isInvalid = true;
    } else if (reviewLength < 200) {
      errors.push("review");
      isInvalid = true;
    }

    if (!data.lastLivedYear) {
      errors.push("year");
      isInvalid = true;
    } else {
      const val = parseInt(data.lastLivedYear.toString());
      const currentYear = new Date().getFullYear();
      if (data.lastLivedYear > currentYear || data.lastLivedYear < 1920) {
        errors.push("year");
        isInvalid = true;
      }
    }
    if (!data.title) {
      errors.push("title");
      isInvalid = true;
    }

    if (!rating) {
      errors.push("rating");
      isInvalid = true;
    }

    if (isInvalid) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    setIsSubmitting(true);
    const id = cuid();

    try {
      if (editReviewId) {
        await updateReviewCommand({
          data: {
            id: editReviewId,
            body: data.body,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            title: data.title,
            userId: user.id,
            rating: rating!,
            lastLivedYear: parseInt(data.lastLivedYear.toString()),
          },
        });
      } else {
        await createReviewCommand({
          data: {
            id: id,
            body: data.body,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            title: data.title,
            userId: user.id,
            lastLivedYear: parseInt(data.lastLivedYear.toString()),
            rating: rating!,
          },
        });
      }

      toast.success(editReviewId ? "Review updated!" : "Review created!");
      setIsSubmitting(false);

      setCurrentReviewId(editReviewId ? editReviewId : id);
      setIsCreatingReview(false);
      setEditReviewId("");
      setReviewLength(0);
      setRating(undefined);
      reset({
        body: "",
        title: "",
        lastLivedYear: undefined,
      });

      const res = await getReviewsWithinMapBoundsRequest({
        data: {
          bounds: {
            sw: {
              lat: bounds[1],
              lng: bounds[0],
            },
            ne: {
              lat: bounds[3],
              lng: bounds[2],
            },
          },
          coordinates: {
            lat: coordinates.lat,
            lng: coordinates.lng,
          },
        },
      });
      setMapViewSearchStatus("SEARCHED");

      const featureData: Partial<Review>[] = await res.json();
      setReviewFeatures(reviewsToFeatures(featureData));
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  };

  useEffect(() => {
    if (isCreatingReview) {
      executeScroll();
    }
  }, [isCreatingReview]);

  useEffect(() => {
    setFormErrors([]);
  }, [rating]);

  const formRef = useRef(null);
  const executeScroll = () => {
    //@ts-ignore
    formRef?.current && formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getReview = async () => {
      const res = await getReviewByIdRequest({
        data: {
          id: editReviewId,
        },
      });

      const review = await res.json();

      reset({
        title: review.title,
        body: review.body,
        lastLivedYear: review.lastLivedYear,
      });

      setRating(review.rating);
      setReviewLength(review.body.length);
    };

    if (editReviewId) {
      getReview();
    }
  }, [editReviewId]);

  if (!isCreatingReview) {
    return null;
  }

  if (currentTab !== "MAP") {
    return null;
  }

  return (
    <Card className="mt-4">
      <div className="w-full " ref={formRef}>
        {user?.id ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
              setFormErrors([]);
            }}
            className="overflow-hidden relative flex flex-col gap-6 items-center justify-center w-full p-2 "
            autoComplete="off"
          >
            <div className="flex flex-row justify-between items-start gap-2 w-full">
              <div className="flex flex-col gap-2">
                <CoordinatesDisplay
                  preText={
                    editReviewId ? "Editing review at" : "Writing review at"
                  }
                  className=" text-lg md:text-2xl gap-1 md:gap-2"
                  iconSize="MEDIUM"
                />

                <p className="text-sm italic">
                  Drag the map pin to adjust review coordinates
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setIsCreatingReview(false);
                  setEditReviewId("");
                  setRating(undefined);
                  setReviewLength(0);
                  reset({
                    body: "",
                    title: "",
                    lastLivedYear: undefined,
                  });
                }}
                outlineColor="red"
                className=" flex flex-row gap-1 items-center justify-center"
                border="thin"
              >
                <XMarkIcon className="h-5 w-5 " />
                <p>Cancel</p>
              </Button>
            </div>

            <div className="flex flex-col w-full md:w-10/12 gap-2">
              <label htmlFor="title" className="text-lg">
                Title
              </label>
              <input
                {...register("title")}
                placeholder="Can't think of a good title? Just put the name of the town"
                className="border rounded border-stone-400 w-full  outline-violet-300 p-2 shadow-sm font-light text-base"
                id="title"
              />
            </div>

            <div className="flex flex-col w-full md:w-10/12 gap-2 h-72">
              <label htmlFor="body" className="text-lg">
                Review
              </label>
              <textarea
                {...register("body")}
                placeholder="Minimum 200 characters"
                className="border rounded border-stone-400  w-full  outline-violet-300 p-2 shadow-sm h-full font-light text-base"
                id="body"
                onChange={(e) => {
                  setReviewLength(e.target.value.length);
                }}
              />
              <div className="flex flex-row justify-between">
                <p
                  className={`${
                    reviewLength < 200 ? "text-red-500" : "text-emerald-500"
                  }`}
                >{`${reviewLength}/200`}</p>
                <Button
                  type="button"
                  className="text-sm"
                  outlineColor="stone"
                  border="thin"
                  onClick={() => {
                    setIsWhatToWriteModalOpen(true);
                  }}
                >
                  What should I write?
                </Button>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-10/12 gap-2">
              <label htmlFor="lastLivedYear" className="text-lg">
                The year you last lived here
              </label>
              <input
                {...register("lastLivedYear")}
                placeholder="e.g. 2021"
                className="border rounded border-stone-400 w-full  outline-violet-300 p-2 text-base shadow-sm font-light"
                id="lastLivedYear"
                type={"number"}
              />
            </div>

            <div className="flex flex-col w-full md:w-10/12 gap-2">
              <label htmlFor="rating" className="text-lg">
                Overall experience
              </label>
              <div className="flex flex-row gap-4 text-sm text-center bg-">
                <Button
                  type="button"
                  outlineColor="stone"
                  border="thin"
                  onClick={() => {
                    setRating(1);
                  }}
                  selected={rating == 1}
                  selectedClassName="bg-rose-600  !text-stone-50 !border-stone-50"
                >
                  Negative
                </Button>
                <Button
                  type="button"
                  outlineColor="stone"
                  border="thin"
                  onClick={() => setRating(2)}
                  selected={rating == 2}
                  selectedClassName="bg-blue-600 !text-stone-50 !border-stone-50"
                >
                  Neutral
                </Button>
                <Button
                  type="button"
                  outlineColor="stone"
                  border="thin"
                  onClick={() => setRating(3)}
                  selected={rating == 3}
                  selectedClassName="bg-emerald-600 !text-stone-50 !border-stone-50"
                >
                  Positive
                </Button>
              </div>
            </div>

            {formErrors.length > 0 && (
              <div className="text-rose-600 text-lg w-full md:w-10/12">
                {`Missing or invalid field${
                  formErrors.length === 1 ? "" : "s"
                }: ${formErrors.join(", ")}.`}
              </div>
            )}

            <Button
              outlineColor="petal"
              spinnerSize={7}
              type="submit"
              border="thin"
              className="mb-4"
              loading={isSubmitting}
            >
              {editReviewId ? "Save changes" : "Submit review"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full p-2 ">
            <p className="text-lg">You must be signed in to write a review</p>
            <AuthButton outlineColor="petal" border="thin" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default ReviewForm;
