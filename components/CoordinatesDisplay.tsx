import classNames from "classnames";
import React from "react";
import uzeStore from "../lib/store/store";
import { RxCrosshair2 } from "react-icons/rx";

export interface CoordinatesDisplayProps {
  preText: string;
  className?: string;
  iconSize?: "SMALL" | "MEDIUM" | "LARGE";
  overrideCoordinates?: { lat: number; lng: number };
}

function CoordinatesDisplay({
  preText,
  className,
  iconSize,
  overrideCoordinates,
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
        className={classNames("h-4 w-4 text-stone-700 ", {
          "h-3 w-3 md:h-4 md:w-4": iconSize === "SMALL",
          "h-4 w-4 md:h-6 md:w-6": iconSize === "MEDIUM",
          "h-6 w-6 md:h-8 md:w-8": iconSize === "LARGE",
        })}
      />
      {/* <p className="">{preText}</p> */}
      <div className={classNames("flex flex-row", className)}>
        <div className="flex flex-row">
          <p className={latLngClassName}>
            {overrideCoordinates
              ? overrideCoordinates.lat.toFixed(4)
              : coordinates.lat.toFixed(4)}
          </p>
          <p className="">,</p>
        </div>
        <p className={latLngClassName}>
          {overrideCoordinates
            ? overrideCoordinates.lng.toFixed(4)
            : coordinates.lng.toFixed(4)}
        </p>
      </div>
    </div>
  );
}

export default CoordinatesDisplay;
