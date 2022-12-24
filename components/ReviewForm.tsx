import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createReviewCommand,
  getReviewByIdRequest,
  getReviewsWithinMapBoundsRequest,
} from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Button from "./ui/Button";
import Card from "./ui/Card";
import cuid from "cuid";
import { bounds } from "leaflet";
import { Review } from "@prisma/client";
import { reviewsToFeatures } from "../lib/util/review-utils";

type FormData = {
  body: string;
  title: string;
};

function ReviewForm() {
  const coordinates = uzeStore((state) => state.coordinates);
  const user = uzeStore((state) => state.user);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { setIsCreatingReview, setCurrentReviewId } = uzeStore(
    (state) => state.actions
  );
  const currentTab = uzeStore((state) => state.currentTab);
  const isDragging = uzeStore((state) => state.isDragging);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState<number | undefined>(undefined);
  const bounds = uzeStore((state) => state.bounds);
  const { setIsMapViewUnsearched, setReviewFeatures } = uzeStore(
    (state) => state.actions
  );

  const onSubmit = async (data: FormData) => {
    let isInvalid = false;
    const errors: string[] = [];
    if (!data.body) {
      errors.push("review");

      isInvalid = true;
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
      await createReviewCommand({
        data: {
          id: id,
          body: data.body,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          title: data.title,
          userId: user.id,
          rating: rating!,
        },
      });

      toast.success("Review created!");
      setIsSubmitting(false);

      setCurrentReviewId(id);
      setIsCreatingReview(false);
      setRating(undefined);
      reset();

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
      setIsMapViewUnsearched(false);

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

  if (!isCreatingReview) {
    return null;
  }

  return (
    <Card>
      <form
        ref={formRef}
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
              preText="Writing a review at"
              className=" text-lg md:text-2xl gap-1 md:gap-2"
            />
            <p className="text-sm italic">
              Drag the map pin or search again to change coordinates
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              setIsCreatingReview(false);
              setRating(undefined);
              reset();
            }}
            outlineColor="red"
            className=" "
            border="thin"
          >
            Cancel
          </Button>
        </div>

        <div className="flex flex-col w-full md:w-10/12 gap-2">
          <label htmlFor="title" className="text-lg">
            Title
          </label>
          <input
            {...register("title")}
            placeholder="Add a title here"
            className="border rounded border-stone-400 w-full  outline-violet-300 p-2 shadow-sm"
            id="title"
          />
        </div>

        <div className="flex flex-col w-full md:w-10/12 gap-2">
          <label htmlFor="body" className="text-lg">
            Review
          </label>
          <textarea
            {...register("body")}
            placeholder="Write your review here"
            className="border rounded border-stone-400  w-full  outline-violet-300 p-2 shadow-sm"
            id="body"
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
              selectedClassName="bg-rose-400  !text-stone-50 !border-stone-50"
            >
              Negative
            </Button>
            <Button
              type="button"
              outlineColor="stone"
              border="thin"
              onClick={() => setRating(2)}
              selected={rating == 2}
              selectedClassName="bg-blue-400 !text-stone-50 !border-stone-50"
            >
              Neutral
            </Button>
            <Button
              type="button"
              outlineColor="stone"
              border="thin"
              onClick={() => setRating(3)}
              selected={rating == 3}
              selectedClassName="bg-emerald-400 !text-stone-50 !border-stone-50"
            >
              Positive
            </Button>
          </div>
        </div>

        {formErrors.length > 0 && (
          <div className="text-rose-600 text-lg w-full md:w-10/12">
            {`Missing field${
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
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default ReviewForm;
