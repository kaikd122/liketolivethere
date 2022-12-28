import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Review, towns } from "@prisma/client";
import result from "postcss/lib/result";
import { nextTick } from "process";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { getReviewsNearTownRequest } from "../lib/actions/review";
import {
  getNearbyTownsRequest,
  getTownByIdRequest,
} from "../lib/actions/search";
import { TOWN_REVIEWS_PAGE_SIZE } from "../lib/constants";
import uzeStore from "../lib/store/store";
import { onlyUnique } from "../lib/util/general";
import { getPostcodeOutcode } from "../lib/util/map-utils";
import CoordinatesDisplay from "./CoordinatesDisplay";
import ReviewContent from "./ReviewContent";
import ReviewStub from "./ReviewStub";
import Button from "./ui/Button";
import ViewOnMapButton from "./ViewOnMapButton";

export interface TownReviewsListProps {}

export interface ReviewWithDistance extends Partial<Review> {
  distance: number;
}

function TownReviewsList() {
  const [reviews, setReviews] = useState<ReviewWithDistance[]>([]);
  const currentTownId = uzeStore((state) => state.currentTownId);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllCurrentTownReviewsLoaded, setIsAllCurrentTownReviewsLoaded] =
    useState(false);
  const [town, setTown] = useState<Partial<towns>>();
  const [nearbyTowns, setNearbyTowns] = useState<Array<Partial<towns>>>([]);

  const {
    setIsCreatingReview,
    setViewOnMapSource,
    setCurrentTab,
    setCurrentTownId,
  } = uzeStore((state) => state.actions);

  useEffect(() => {
    if (!currentTownId) {
      setReviews([]);
      setIsAllCurrentTownReviewsLoaded(true);
      return;
    }
    const main = async () => {
      try {
        setIsLoading(true);
        const res = await getReviewsNearTownRequest({
          data: {
            townId: currentTownId,
            offset: 0,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length < TOWN_REVIEWS_PAGE_SIZE) {
            setIsAllCurrentTownReviewsLoaded(true);
          } else {
            setIsAllCurrentTownReviewsLoaded(false);
          }
          setReviews(data);
        }
        const townRes = await getTownByIdRequest({
          data: {
            id: currentTownId,
          },
        });
        if (townRes.ok) {
          const townData = await townRes.json();
          setTown(townData);
          const nearbyRes = await getNearbyTownsRequest({
            data: {
              latitude: Number(townData?.latitude),
              longitude: Number(townData?.longitude),
              limit: 6,
            },
          });
          if (nearbyRes.ok) {
            const data: Partial<towns>[] = await nearbyRes.json();
            setNearbyTowns(data.filter((t) => t.id !== currentTownId));
            console.log(data);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    main();
  }, [currentTownId]);

  if (!currentTownId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-5xl">{town?.name}</h1>
        <h2 className="text-lg">
          {town?.county}, {getPostcodeOutcode(town?.postcode_sector)}
        </h2>
      </div>
      <div>
        <div className="flex flex-row justify-between items-center w-full flex-wrap gap-2">
          <CoordinatesDisplay
            iconSize="MEDIUM"
            preText=""
            className="text-xl gap-2"
            overrideCoordinates={{
              lat: Number(town?.latitude),
              lng: Number(town?.longitude),
            }}
          />
          <div className="flex flex-row gap-4 items-center justify-center ">
            <ViewOnMapButton
              withText
              town={town}
              coordinates={{
                lat: Number(town?.latitude),
                lng: Number(town?.longitude),
              }}
            />
            <ViewOnMapButton
              coordinates={{
                lat: Number(town?.latitude),
                lng: Number(town?.longitude),
              }}
              writeMode
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row  gap-4 flex-wrap  py-1 items-end">
        {nearbyTowns.map((nt) => {
          return (
            <Button
              bgColor="petalGradient"
              outlineColor="light"
              border="none"
              key={nt.id}
              className="text-sm"
              onClick={async () => {
                setCurrentTownId(nt.id!);

                // replaceUrl(getTownUrl(town));
              }}
            >
              {nt.name}
            </Button>
          );
        })}
      </div>
      {reviews?.length > 0 ? (
        reviews
          .filter((val, i) =>
            onlyUnique(
              val.id,
              i,
              reviews.map((r) => r.id)
            )
          )
          .map((review) => {
            return <ReviewStub key={`${review.id}-stub`} review={review} />;
          })
      ) : isLoading ? (
        <div className="flex justify-center items-center flex-row w-full">
          <BeatLoader color={"#a743e4"} />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row w-full">
          <span className="text-lg">No reviews within 2km</span>
        </div>
      )}
      {!isAllCurrentTownReviewsLoaded && (
        <div className="flex justify-center items-center flex-row w-full">
          <Button
            onClick={async () => {
              try {
                const res = await getReviewsNearTownRequest({
                  data: {
                    townId: currentTownId!,
                    offset: reviews.length,
                  },
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.length < TOWN_REVIEWS_PAGE_SIZE) {
                    setIsAllCurrentTownReviewsLoaded(true);
                  }
                  setReviews([...reviews, ...data]);
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

export default TownReviewsList;
