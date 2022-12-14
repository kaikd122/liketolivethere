import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createReviewCommand } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";

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

  return (
    <div className={`${isCreatingReview ? "" : "hidden"}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col gap-4 items-center justify-center p-8 border border-stone-300 rounded shadow"
        autoComplete="off"
      >
        {coordinates?.lat && coordinates?.lng && (
          <div className="absolute left-4 top-4 text-sm">
            {`Lat lng: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(
              4
            )}`}
            <br />
            <p className="italic text-xs pt-1">
              Drag map pin to adjust review coordinates
            </p>
          </div>
        )}

        <Button
          type="button"
          onClick={() => setIsCreatingReview(false)}
          outlineColor="red"
          className="absolute top-4 right-4 "
          borderThickness="thin"
        >
          Cancel
        </Button>

        <label htmlFor="title" className="mt-6">
          Title
        </label>
        <input
          {...register("title")}
          placeholder="Title"
          className="border border-stone-700 w-3/4 outline-violet-500 p-2"
          id="title"
        />

        <label htmlFor="body">Review</label>
        <textarea
          {...register("body")}
          placeholder="Write review here"
          className="border border-stone-700 w-3/4 outline-none p-2"
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
          <div className="text-red-700 text-sm">
            {`Missing field(s): ${formErrors.join(", ")}.`}
          </div>
        )}
      </form>
    </div>
  );
}

export default ReviewForm;
