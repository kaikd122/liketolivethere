import { Review } from "@prisma/client";
import result from "postcss/lib/result";
import React, { useEffect, useState } from "react";
import { getReviewsNearTownRequest } from "../lib/actions/review";
import { TOWN_REVIEWS_PAGE_SIZE } from "../lib/constants";
import uzeStore from "../lib/store/store";
import { onlyUnique } from "../lib/util/general";
import Button from "./ui/Button";

export interface TownReviewsListProps {
  initialReviews: Partial<Review>[];
}

function TownReviewsList({ initialReviews }: TownReviewsListProps) {
  const [reviews, setReviews] = useState<Partial<Review>[]>(initialReviews);
  const currentTownId = uzeStore((state) => state.currentTownId);
  const [isAllCurrentTownReviewsLoaded, setIsAllCurrentTownReviewsLoaded] =
    useState(false);
  return (
    <div className="flex flex-col gap-2">
      {reviews
        .filter((val, i) =>
          onlyUnique(
            val.id,
            i,
            reviews.map((r) => r.id)
          )
        )
        .map((r, i) => {
          return (
            <div key={r.id}>
              {i} - {r.title}-{r.id}
            </div>
          );
        })}
      {!isAllCurrentTownReviewsLoaded && (
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
      )}
    </div>
  );
}

export default TownReviewsList;
