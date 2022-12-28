import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Review, towns } from "@prisma/client";
import result from "postcss/lib/result";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { getReviewsNearTownRequest } from "../lib/actions/review";
import { getTownByIdRequest } from "../lib/actions/search";
import { TOWN_REVIEWS_PAGE_SIZE } from "../lib/constants";
import uzeStore from "../lib/store/store";
import { onlyUnique } from "../lib/util/general";
import CoordinatesDisplay from "./CoordinatesDisplay";
import ReviewContent from "./ReviewContent";
import ReviewStub from "./ReviewStub";
import Button from "./ui/Button";
import ViewOnMapButton from "./ViewOnMapButton";

export interface TownReviewsListProps {
  //   initialReviews: Partial<Review>[];
}

export interface ReviewWithDistance extends Partial<Review> {
  distance: number;
}

function TownReviewsList(props: TownReviewsListProps) {
  const [reviews, setReviews] = useState<ReviewWithDistance[]>([]);
  const currentTownId = uzeStore((state) => state.currentTownId);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllCurrentTownReviewsLoaded, setIsAllCurrentTownReviewsLoaded] =
    useState(false);
  const [town, setTown] = useState<Partial<towns>>();
  const { setIsCreatingReview, setViewOnMapSource } = uzeStore(
    (state) => state.actions
  );

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
            console.log("YAY");
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
          const data = await townRes.json();
          console.log("DAT", data);
          setTown(data);
        } else {
          console.log("POOP");
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
      <div className="flex flex-row justify-center items-center">
        <h1 className="text-4xl">{town?.name}</h1>
      </div>
      <div>
        <div className="flex flex-row justify-between items-center flex-wrap gap-2">
          <CoordinatesDisplay
            iconSize="MEDIUM"
            preText=""
            className="text-lg md:text-2xl gap-1 md:gap-2"
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
