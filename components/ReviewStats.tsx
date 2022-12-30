import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useMemo } from "react";
import uzeStore from "../lib/store/store";
import { pluralise } from "../lib/util/general";
import { reviewFeaturesToDetails } from "../lib/util/review-utils";

function ReviewStats() {
  const reviewFeatures = uzeStore((state) => state.reviewFeatures);
  const isMapViewUnsearched = uzeStore((state) => state.isMapViewUnsearched);
  const details = useMemo(() => {
    return reviewFeaturesToDetails(reviewFeatures);
  }, [reviewFeatures]);

  const negativePercent = (details.negativeCount / details.count) * 100;
  const positivePercent = (details.positiveCount / details.count) * 100;
  const neutralPercent = (details.neutralCount / details.count) * 100;

  return (
    <div className=" flex flex-col gap-2 py-5 px-3 md:px-0">
      <span className="text-2xl">Stats</span>
      {details.count === 0 && !isMapViewUnsearched ? (
        <span className="whitespace-pre text">
          There are no reviews in the current map view
        </span>
      ) : !isMapViewUnsearched ? (
        <>
          <span className="whitespace-pre text">{`There ${
            details.count === 1 ? "is" : "are"
          } ${details.count} ${pluralise({
            count: details.count,
            singular: "review",
            plural: "reviews",
          })} in the current map view`}</span>
          <div className="flex flex-col w-3/4 md:w-1/2 gap-1">
            {details.negativeCount > 0 && (
              <div className="flex flex-row gap-2 h-6 items-center w-full">
                <div
                  className="h-full bg-rose-600 border-x border-stone-50 rounded shadow-sm"
                  style={{ width: `${negativePercent}%` }}
                />
                <span className="text-sm w-1/3">{`${details.negativeCount} negative`}</span>
              </div>
            )}
            {details.neutralCount > 0 && (
              <div className="flex flex-row gap-2 h-6 items-center w-full">
                <div
                  className="h-full bg-blue-600 border-x border-stone-50  rounded shadow-sm"
                  style={{ width: `${neutralPercent}%` }}
                />
                <span className="text-sm w-1/3">{`${details.neutralCount} neutral`}</span>
              </div>
            )}
            {details.positiveCount > 0 && (
              <div className="flex flex-row gap-2 h-6 items-center w-full ">
                <div
                  className="h-full bg-emerald-600 border-x border-stone-50 rounded shadow-sm"
                  style={{ width: `${positivePercent}%` }}
                />
                <span className="text-sm w-1/3 ">{`${details.positiveCount} positive`}</span>
              </div>
            )}
            {details.count && (
              <p className="text-sm italic pt-2">
                Click on a map pin to open a review
              </p>
            )}
          </div>
        </>
      ) : (
        <span className="italic whitespace-pre ">
          Click <span className="font-medium not-italic"> Search here </span> on
          the map to get stats for the current map view
        </span>
      )}
    </div>
  );
}

export default ReviewStats;
