import React from "react";
import { useForm } from "react-hook-form";

function ReviewForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center border border-stone-700 p-8"
    >
      <input
        {...register("body", { required: true })}
        placeholder="Write review here"
        type={"textArea"}
        className="border border-stone-700"
      />

      <input {...register("rating", { required: true })} type="select" />
      <input type="submit" />
    </form>
  );
}

export default ReviewForm;
