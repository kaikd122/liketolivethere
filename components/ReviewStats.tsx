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

  const negativePercentageClass = (details.negativeCount / details.count) * 100;
  const positivePercentageClass = (details.positiveCount / details.count) * 100;
  const neutralPercentageClass = (details.neutralCount / details.count) * 100;

  console.log(negativePercentageClass);

  return (
    <div className="flex flex-col gap-1 py-3 px-3 md:px-0">
      <div className="flex rounded  shadow-sm   h-5 w-1/2 overflow-hidden">
        {details.negativeCount > 0 && (
          <div
            className="h-full bg-rose-400 border-x border-stone-50"
            style={{ width: `${negativePercentageClass}%` }}
          ></div>
        )}
        {details.neutralCount > 0 && (
          <div
            className="h-full bg-blue-400 border-x border-stone-50"
            style={{ width: `${neutralPercentageClass}%` }}
          ></div>
        )}
        {details.positiveCount > 0 && (
          <div
            className="h-full bg-emerald-400 border-x border-stone-50"
            style={{ width: `${positivePercentageClass}%` }}
          ></div>
        )}
      </div>
      <div className="flex flex-row  flex-wrap">
        <span className="whitespace-pre">{`${details.count} ${pluralise({
          count: details.count,
          singular: "review",
          plural: "reviews",
        })}: `}</span>
        <span className="whitespace-pre text-rose-500">
          {details.negativeCount}{" "}
        </span>
        <span className="whitespace-pre">negative, </span>
        <span className="whitespace-pre text-blue-500">
          {details.neutralCount}{" "}
        </span>
        <span className="whitespace-pre">neutral, and </span>
        <span className="whitespace-pre text-emerald-500">
          {details.positiveCount}{" "}
        </span>
        <span className="whitespace-pre">positive</span>
      </div>
    </div>
  );
}

export default ReviewStats;
