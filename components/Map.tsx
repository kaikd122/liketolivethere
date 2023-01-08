import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl, { Control } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";

import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import {
  ArrowUturnLeftIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { getNearbyTownsRequest } from "../lib/actions/search";
import { Review, towns } from "@prisma/client";
import CoordinatesDisplay from "./CoordinatesDisplay";
import ReviewMarkers from "./ReviewMarkers";
import {
  getRandomReviewRequest,
  getReviewsNearTownRequest,
  getReviewsWithinMapBoundsRequest,
} from "../lib/actions/review";
import FlyTo from "./FlyTo";
import { Geocoder } from "./Geocoder";
import {
  reviewFeaturesToDetails,
  reviewsToFeatures,
} from "../lib/util/review-utils";
import ReviewStats from "./ReviewStats";
import ZoomControl from "./ZoomControl";
import { RxShuffle } from "react-icons/rx";
import classNames from "classnames";
import { BeatLoader } from "react-spinners";
import { mapContext } from "./context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

function MapContainer() {
  const coordinates = uzeStore((state) => state.coordinates);
  const {
    setCoordinates,
    setIsCreatingReview,
    setIsDragging,
    setCurrentTab,
    setIsMapLoaded,
    setReviewFeatures,
    setMapViewSearchStatus,
    setZoom,
    setBounds,
    setCurrentTownId,
    setViewOnMapSource,
    setEditReviewId,
  } = uzeStore((state) => state.actions);
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const [nearbyTowns, setNearbyTowns] = useState<Array<Partial<towns>>>([]);
  const isDragging = uzeStore((state) => state.isDragging);
  const mapViewSearchStatus = uzeStore((state) => state.mapViewSearchStatus);
  const zoom = uzeStore((state) => state.zoom);
  const bounds = uzeStore((state) => state.bounds);
  const mapRef = useRef(null);

  useEffect(() => {
    const getNearbyTowns = async () => {
      getNearbyTownsRequest({
        data: {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          limit: 5,
        },
      }).then(async (res) => {
        const data = await res.json();
        setNearbyTowns(data);
      });
    };

    getNearbyTowns();
  }, [coordinates]);

  return (
    <div className={`flex flex-col ${currentTab === "MAP" ? "" : "hidden"}`}>
      {coordinates?.lat && coordinates?.lng ? (
        <div className="pt-3 flex flex-row justify-between items-center px-3 md:px-0 flex-wrap gap-2">
          <CoordinatesDisplay
            preText={`${
              isCreatingReview ? "Review coordinates:" : "Centre coordinates:"
            }`}
            className="text-base gap-1"
            iconSize="SMALL"
          />
          <div className="flex flex-row gap-3">
            <Button
              outlineColor="petal"
              border="thin"
              className="flex flex-row gap-2 items-center justify-center"
              onClick={async () => {
                try {
                  const res = await getRandomReviewRequest();
                  if (res.ok) {
                    const jsonRes: Review[] = await res.json();
                    const randomReview = jsonRes[0];

                    setIsCreatingReview(false);
                    setCoordinates({
                      lat: Number(randomReview.latitude),
                      lng: Number(randomReview.longitude),
                    });
                    setViewOnMapSource({
                      type: "REVIEW",
                      id: randomReview.id,
                    });
                    setMapViewSearchStatus("SEARCHED");
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <RxShuffle />
              <p>Random review</p>
            </Button>
            {!isCreatingReview ? (
              <Button
                outlineColor="petal"
                border="thin"
                onClick={() => {
                  setIsCreatingReview(true);
                }}
                className="flex flex-row gap-1"
              >
                <PencilSquareIcon className="w-5 h-5 items-center justify-center" />
                <p> Write a review</p>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setIsCreatingReview(false);
                  setEditReviewId("");
                }}
                outlineColor="petal"
                border="thin"
                className="flex flex-row gap-1 items-center justify-center"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                <p>Return to explore mode</p>
              </Button>
            )}{" "}
          </div>
        </div>
      ) : null}

      <div className="flex flex-row  gap-4 flex-wrap px-3 md:px-0 pt-3">
        {nearbyTowns.map((town) => {
          return (
            <Button
              bgColor="petalGradient"
              outlineColor="light"
              border="none"
              key={town.id}
              className="text-sm"
              onClick={async () => {
                setCurrentTab("TOWNS");
                setCurrentTownId(town.id!);

                // replaceUrl(getTownUrl(town));
              }}
            >
              {town.name}
            </Button>
          );
        })}
      </div>
      {!isCreatingReview && <ReviewStats />}
    </div>
  );
}

export default MapContainer;
