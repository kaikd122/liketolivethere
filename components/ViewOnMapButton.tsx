import { MapPinIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { towns } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import React from "react";
import uzeStore from "../lib/store/store";
import { Coordinates } from "../types/types";
import { ReviewWithDistance } from "./TownReviewsList";
import Button from "./ui/Button";

export interface ViewOnMapButtonProps {
  coordinates: Coordinates;
  review?: ReviewWithDistance;
  town?: Partial<towns>;
  withText?: boolean;
  writeMode?: boolean;
}
function ViewOnMapButton({
  coordinates,
  review,
  town,
  withText,
  writeMode,
}: ViewOnMapButtonProps) {
  const {
    setCurrentTab,
    setCoordinates,
    setViewOnMapSource,
    setReviewFeatures,
    setIsMapViewUnsearched,
    setIsCreatingReview,
  } = uzeStore((state) => state.actions);
  return (
    <Button
      outlineColor="petal"
      border="thin"
      className="flex flex-row gap-1 items-center justify-center "
      onClick={() => {
        setCoordinates(coordinates);
        setCurrentTab("MAP");
        setIsCreatingReview(!!writeMode);
        setViewOnMapSource({
          type: writeMode ? "WRITE" : review?.id ? "REVIEW" : "TOWN",
          id: review?.id || town?.id?.toString() || "new-review",
        });

        setIsMapViewUnsearched(false);
      }}
    >
      {writeMode ? (
        <>
          <PencilSquareIcon className="w-5 h-5 items-center justify-center" />

          <p>Write a review</p>
        </>
      ) : (
        <>
          <MapPinIcon className="h-5 w-5" />
          {withText && <p>View on map</p>}{" "}
        </>
      )}
    </Button>
  );
}

export default ViewOnMapButton;
