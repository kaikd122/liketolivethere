import { MapPinIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { towns } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import Link from "next/link";
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
    setCurrentReviewId,
  } = uzeStore((state) => state.actions);
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);
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
        // setCurrentReviewId("");
        //can't remember why this is here

        setIsMapViewUnsearched(false);
      }}
    >
      {writeMode ? (
        isMapLoaded ? (
          <>
            <PencilSquareIcon className="w-5 h-5 items-center justify-center" />

            <p>Write a review</p>
          </>
        ) : (
          <Link
            href="/"
            className="flex flex-row w-full items-center justify-center"
          >
            <PencilSquareIcon className="w-5 h-5 items-center justify-center" />

            <p>Write a review</p>
          </Link>
        )
      ) : isMapLoaded ? (
        <>
          <MapPinIcon className="h-5 w-5" />
          {withText && <p>View on map</p>}{" "}
        </>
      ) : (
        <Link
          href="/"
          className="flex flex-row w-full items-center justify-center"
        >
          <MapPinIcon className="h-5 w-5" />
          {withText && <p>View on map</p>}{" "}
        </Link>
      )}
    </Button>
  );
}

export default ViewOnMapButton;
