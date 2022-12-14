import React from "react";
import classNames from "classnames";

export interface ButtonProps {
  children: React.ReactNode;
  outlineColor?: "violet" | "stone" | "light" | "red";
  bgColor?: "violet" | "stone" | "light" | "red";
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "button" | "submit" | "reset" | undefined;
  borderThickness?: "thin" | "thick";
}

function Button({
  onClick,
  children,
  outlineColor,
  bgColor,
  className,
  type,
  borderThickness: border,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        "shadow-sm rounded p-2 active:scale-100 duration-75 hover:scale-105",
        {
          "border-violet-500 text-violet-500": outlineColor === "violet",
          "border-stone-700 text-stone-700": outlineColor === "stone",
          "border-stone-50 text-stone-50": outlineColor === "light",
          "bg-violet-500": bgColor === "violet",
          "bg-stone-700": bgColor === "stone",
          "bg-stone-50": bgColor === "light",
          "bg-rose-400": bgColor === "red",
          "border-rose-400 text-rose-400": outlineColor === "red",
          border: border === "thin",
          "border-2": border === "thick",
        },
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
