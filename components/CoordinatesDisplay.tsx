import classNames from "classnames";
import React from "react";
import uzeStore from "../lib/store/store";

export interface CoordinatesDisplayProps {
  preText: string;
  className?: string;
}

function CoordinatesDisplay({ preText, className }: CoordinatesDisplayProps) {
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
      <p className="">{preText}</p>
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
