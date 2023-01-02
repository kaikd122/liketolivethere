import React from "react";
import classNames from "classnames";
import { BeatLoader } from "react-spinners";

export interface ButtonProps {
  children?: React.ReactNode;
  outlineColor?: "violet" | "stone" | "light" | "red" | "petal";
  bgColor?: "violet" | "stone" | "light" | "red" | "petal" | "petalGradient";
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "button" | "submit" | "reset" | undefined;
  border?: "thin" | "thick" | "none";
  shadow?: "none";
  loading?: boolean;
  spinnerSize?: number;
  selected?: boolean;
  selectedClassName?: string;
  smallScale?: boolean;
  disabled?: boolean;
}

function Button({
  onClick,
  children,
  outlineColor,
  bgColor,
  className,
  type,
  border,
  shadow,
  loading,
  spinnerSize,
  selected,
  selectedClassName,
  smallScale,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={classNames(
        "  relative shadow-sm rounded py-1 px-2 active:scale-100 duration-75 hover:scale-105",
        {
          "border-violet-500 text-violet-500": outlineColor === "violet",
          "border-stone-400 text-stone-700 ": outlineColor === "stone",
          "border-stone-50 text-stone-50": outlineColor === "light",
          "border-petal text-petal": outlineColor === "petal",
          "bg-violet-500": bgColor === "violet",
          "bg-petal": bgColor === "petal",
          "bg-stone-700": bgColor === "stone",
          "bg-stone-50": bgColor === "light",
          "bg-rose-600": bgColor === "red",
          "border-rose-600 text-rose-600": outlineColor === "red",
          "bg-gradient-to-br from-violet-500 to-fuchsia-600":
            bgColor === "petalGradient",
          border: border === "thin",
          "border-2": border === "thick",
          "border-0": border === "none",
          "shadow-none": shadow === "none",
          "hover:scale-[102%]": smallScale,
        },
        className,
        selected && selectedClassName
      )}
    >
      {loading ? (
        <BeatLoader loading={loading} size={spinnerSize} color={"#a743e4"} />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
