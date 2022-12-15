import classNames from "classnames";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createReviewCommand } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import Card from "./ui/Card";

type FormData = {
  body: string;
  rating: string;
  title: string;
};

function ReviewForm() {
  const coordinates = uzeStore((state) => state.coordinates);
  const user = uzeStore((state) => state.user);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { setIsCreatingReview } = uzeStore((state) => state.actions);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const isDragging = uzeStore((state) => state.isDragging);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    let isInvalid = false;
    const errors: string[] = [];
    console.log("hi");
    if (!data.body) {
      errors.push("review");

      isInvalid = true;
    }

    if (!data.title) {
      errors.push("title");
      isInvalid = true;
    }

    if (!data.rating) {
      errors.push("rating");
      isInvalid = true;
    }

    if (isInvalid) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    console.log(data);
    createReviewCommand({
      data: {
        body: data.body,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        title: data.title,
        userId: user.id,
        rating: parseInt(data.rating),
      },
    });
  };

  const latLngClassName = classNames({
    "text-stone-400": isDragging,
    "text-violet-500": !isDragging,
  });
  return (
    <Card className={`${isCreatingReview ? "" : "hidden"}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col gap-4 items-center justify-center w-full  "
        autoComplete="off"
      >
        <div className="flex flex-row justify-between w-full">
          {coordinates?.lat && coordinates?.lng ? (
            <div className="flex flex-col">
              <div className={"text-sm flex flex-row"}>
                <p className="pr-1">Lat lng:</p>
                <p className={latLngClassName}>{coordinates.lat.toFixed(4)}</p>
                <p className="pr-1">,</p>
                <p className={latLngClassName}>{coordinates.lng.toFixed(4)}</p>
                <br />
              </div>
              <p className="italic text-xs pt-1">
                Drag map pin to adjust review coordinates
              </p>
            </div>
          ) : (
            <div />
          )}
          <Button
            type="button"
            onClick={() => setIsCreatingReview(false)}
            outlineColor="red"
            className=" "
            borderThickness="thin"
          >
            Cancel
          </Button>
        </div>

        <label htmlFor="title" className="mt-6">
          Title
        </label>
        <input
          {...register("title")}
          placeholder="Title"
          className="border rounded border-stone-300 w-3/4 outline-violet-300 p-2 shadow-sm"
          id="title"
        />

        <label htmlFor="body">Review</label>
        <textarea
          {...register("body")}
          placeholder="Write review here"
          className="border rounded border-stone-300 w-3/4 outline-violet-300 p-2 shadow-sm"
          id="body"
        />

        <label htmlFor="rating-radios">Overall experience</label>
        <div
          className="flex flex-row gap-4 text-sm text-center"
          id="rating-radios"
        >
          <div className="flex flex-col gap-4 justify-center items-center">
            <input
              type="radio"
              {...register("rating")}
              value={"3"}
              id="rating-positive"
              className=" appearance-none h-5 w-5 border border-stone-700 checked:bg-emerald-400 hover:cursor-pointer hover:bg-emerald-400"
            />
            <label htmlFor="rating-positive">Positive</label>
          </div>

          <div className="flex flex-col gap-4 justify-center items-center hover:cursor-pointer">
            <input
              type="radio"
              {...register("rating")}
              value={"2"}
              id="rating-neutral"
              className=" appearance-none h-5 w-5 border border-stone-700 checked:bg-blue-400 hover:cursor-pointer hover:bg-blue-400"
            />
            <label htmlFor="rating-neutral">Neutral</label>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <input
              type="radio"
              {...register("rating")}
              value={"1"}
              id="rating-negative"
              className=" appearance-none h-5 w-5 border border-stone-700  checked:bg-rose-400 hover:cursor-pointer hover:bg-rose-400"
            />
            <label htmlFor="rating-negative">Negative</label>
          </div>
        </div>
        <Button outlineColor="violet" type="submit" borderThickness="thin">
          Submit
        </Button>
        {formErrors.length > 0 && (
          <div className="text-rose-700 text-sm">
            {`Missing field${
              formErrors.length === 1 ? "" : "s"
            }: ${formErrors.join(", ")}.`}
          </div>
        )}
      </form>
    </Card>
  );
}

export default ReviewForm;
