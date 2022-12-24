import classNames from "classnames";
import React from "react";
export interface CardProps {
  children: React.ReactNode;
  className?: string;
}
function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        "flex items-center justify-center p-4 border border-stone-400 rounded shadow bg-stone-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
