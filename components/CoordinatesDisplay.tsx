import classNames from "classnames";
import React from "react";
import uzeStore from "../lib/store/store";
import { RxCrosshair2 } from "react-icons/rx";

export interface CoordinatesDisplayProps {
  preText: string;
  className?: string;
  iconSize?: "SMALL" | "MEDIUM" | "LARGE";
}

function CoordinatesDisplay({
  preText,
  className,
  iconSize,
}: CoordinatesDisplayProps) {
  const isDragging = uzeStore((state) => state.isDragging);
  const coordinates = uzeStore((state) => state.coordinates);
  const latLngClassName = classNames({
    "text-stone-400": isDragging,
    "text-petal": !isDragging,
  });
  return (
    <div
      className={classNames("flex flex-row items-center  flex-wrap", className)}
    >
      <RxCrosshair2
        className={classNames("h-4 w-4", {
          "h-4 w-4": iconSize === "SMALL",
          "h-6 w-6": iconSize === "MEDIUM",
          "h-8 w-8": iconSize === "LARGE",
        })}
      />
      {/* <p className="">{preText}</p> */}
      <div className={classNames("flex flex-row", className)}>
        <div className="flex flex-row">
          <p className={latLngClassName}>{coordinates.lat.toFixed(4)}</p>
          <p className="">,</p>
        </div>
        <p className={latLngClassName}>{coordinates.lng.toFixed(4)}</p>
      </div>
    </div>
  );
}

export default CoordinatesDisplay;
