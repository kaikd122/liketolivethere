import React, { useMemo } from "react";
import uzeStore from "../lib/store/store";
import { pluralise } from "../lib/util/general";
import { reviewFeaturesToDetails } from "../lib/util/review-utils";

function ReviewStats() {
  const reviewFeatures = uzeStore((state) => state.reviewFeatures);
  const details = useMemo(() => {
    return reviewFeaturesToDetails(reviewFeatures);
  }, [reviewFeatures]);

  if (details.count === 0) {
    return null;
  }

  const negativePercent = (details.negativeCount / details.count) * 100;
  const positivePercent = (details.positiveCount / details.count) * 100;
  const neutralPercent = (details.neutralCount / details.count) * 100;

  console.log(negativePercent);

  return (
    <div className="flex flex-col gap-1 py-3 px-3 md:px-0">
      <span className="whitespace-pre">{`${details.count} ${pluralise({
        count: details.count,
        singular: "review",
        plural: "reviews",
      })}`}</span>
      <div className="flex flex-col w-1/2 gap-1">
        {details.negativeCount > 0 && (
          <div className="flex flex-row gap-2 h-6 items-center ">
            <div
              className="h-full bg-rose-600 border-x border-stone-50 rounded shadow-sm"
              style={{ width: `${negativePercent}%` }}
            />
            <span className="text-sm">{`${details.negativeCount} negative`}</span>
          </div>
        )}
        {details.neutralCount > 0 && (
          <div className="flex flex-row gap-2 h-6 items-center">
            <div
              className="h-full bg-blue-600 border-x border-stone-50  rounded shadow-sm"
              style={{ width: `${neutralPercent}%` }}
            />
            <span className="text-sm">{`${details.neutralCount} neutral`}</span>
          </div>
        )}
        {details.positiveCount > 0 && (
          <div className="flex flex-row gap-2 h-6 items-center ">
            <div
              className="h-full bg-emerald-600 border-x border-stone-50 rounded shadow-sm"
              style={{ width: `${positivePercent}%` }}
            />
            <span className="text-sm">{`${details.positiveCount} positive`}</span>
          </div>
        )}
      </div>
      <p className="text-sm italic pt-2">Click on a map pin to open a review</p>
    </div>
  );
}

export default ReviewStats;
