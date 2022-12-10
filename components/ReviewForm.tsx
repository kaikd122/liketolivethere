import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useCtx } from "../context/Context";
import { createReviewCommand } from "../lib/actions/review";

type FormData = {
  body: string;
  rating: "positive" | "negative" | "neutral";
};

function ReviewForm() {
  const ctx = useCtx();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data: any) => {
    createReviewCommand({
      data: {
        body: data.body,
        latitude: ctx.currentPoint.coordinates.lat,
        longitude: ctx.currentPoint.coordinates.lng,
        title: "EXAMPLE TITLE",
        userId: ctx.user.id,
      },
    });
  };

  return (
    <div>
      <button
        onClick={() =>
          createReviewCommand({
            data: {
              body: "hi",
              latitude: ctx.currentPoint.coordinates.lat,
              longitude: ctx.currentPoint.coordinates.lng,
              title: "hi",
              userId: ctx.user.id,
            },
          })
        }
      >
        Query
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center justify-center border border-stone-700 p-8"
        autoComplete="off"
      >
        {ctx.currentPoint.coordinates?.lat &&
          ctx.currentPoint.coordinates?.lng && (
            <label htmlFor="body">
              Review for{" "}
              {`${ctx.currentPoint.coordinates.lat.toFixed(
                4
              )},${ctx.currentPoint.coordinates.lng.toFixed(4)}`}
            </label>
          )}
        <textarea
          {...register("body", { required: true })}
          placeholder="Write review here"
          className="border border-stone-700 w-3/4 outline-none p-2"
        />

        <label htmlFor="rating-reviews">Overall experience</label>
        <div
          className="flex flex-row gap-4 text-sm text-center"
          id="rating-radios"
        >
          <div className="flex flex-col gap-4 justify-center items-center">
            <input
              type="radio"
              {...register("rating")}
              value="positive"
              className=" appearance-none h-5 w-5 border border-stone-700 checked:bg-lime-300 hover:cursor-pointer hover:bg-lime-300"
            />
            <label htmlFor="positive">Positive</label>
          </div>

          <div className="flex flex-col gap-4 justify-center items-center hover:cursor-pointer">
            <input
              type="radio"
              {...register("rating")}
              value="neutral"
              className=" appearance-none h-5 w-5 border border-stone-700 checked:bg-blue-400 hover:cursor-pointer hover:bg-blue-400"
            />
            <label htmlFor="neutral">Neutral</label>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <input
              type="radio"
              {...register("rating")}
              value="negative"
              className=" appearance-none h-5 w-5 border border-stone-700  checked:bg-rose-300 hover:cursor-pointer hover:bg-rose-300"
            />
            <label htmlFor="negative">Negative</label>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <button
            className="border border-stone-700 p-2 hover:bg-violet-100"
            type="submit"
          >
            Submit
          </button>
          <button
            className="border border-stone-700 p-2 hover:bg-violet-100"
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
