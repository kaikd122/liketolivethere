import { Review } from "@prisma/client";
import result from "postcss/lib/result";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { getReviewsNearTownRequest } from "../lib/actions/review";
import { TOWN_REVIEWS_PAGE_SIZE } from "../lib/constants";
import uzeStore from "../lib/store/store";
import { onlyUnique } from "../lib/util/general";
import ReviewContent from "./ReviewContent";
import ReviewStub from "./ReviewStub";
import Button from "./ui/Button";

export interface TownReviewsListProps {
  //   initialReviews: Partial<Review>[];
}

function TownReviewsList(props: TownReviewsListProps) {
  const [reviews, setReviews] = useState<Partial<Review>[]>([]);
  const currentTownId = uzeStore((state) => state.currentTownId);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllCurrentTownReviewsLoaded, setIsAllCurrentTownReviewsLoaded] =
    useState(false);

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
          }
          setReviews(data);
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
            return <ReviewStub review={review} />;
          })
      ) : isLoading ? (
        <div className="flex justify-center items-center flex-row w-full">
          <BeatLoader color={"#a743e4"} />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row w-full">
          <span className="text-2xl">No reviews yet</span>
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
