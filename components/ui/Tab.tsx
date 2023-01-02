import React from "react";
import classNames from "classnames";

export interface TabProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selected?: boolean;
}

function Tab({ onClick, children, selected }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "active:scale-100 duration-75 hover:scale-105 text-stone-700  text-lg",
        { "border-b border-petal !text-petal": selected }
      )}
    >
      {children}
    </button>
  );
}

export default Tab;
