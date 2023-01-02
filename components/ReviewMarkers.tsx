import { MapPinIcon } from "@heroicons/react/24/solid";
import { Review } from "@prisma/client";

import React, { useEffect } from "react";
import { Marker, useMap, LayerProps, Source, Layer } from "react-map-gl";
import uzeStore from "../lib/store/store";
import useSupercluster from "use-supercluster";
import { ReviewFeature } from "../types/types";
import classNames from "classnames";
import { useMediaQuery } from "usehooks-ts";

export interface ReviewMarkersProps {
  bounds: Array<number>;
  zoom: number;
}

function ReviewMarkers({ bounds, zoom }: ReviewMarkersProps) {
  const { current: map } = useMap();
  const reviewFeatures = uzeStore((state) => state.reviewFeatures);
  const { setCurrentReviewId, setReviewFeatures } = uzeStore(
    (state) => state.actions
  );
  const editReviewId = uzeStore((state) => state.editReviewId);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 500px)");

  console.log("IS MOBILE", isSmallScreen);

  const { clusters, supercluster } = useSupercluster({
    points: reviewFeatures,
    bounds: bounds as unknown as [number, number, number, number],
    zoom,
    options: { radius: 75, maxZoom: 22 },
  });

  if (reviewFeatures.length === 0) return null;

  return (
    <div className="w-full h-full ">
      {clusters.map((cluster, i) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          try {
            const sc = supercluster.getLeaves(cluster.id, Infinity);

            const num = sc.reduce(
              (acc: number, cur: ReviewFeature) =>
                acc + (cur?.properties?.rating || 2),
              0
            );

            const mean = Math.round(num / sc.length);

            return (
              <Marker
                key={`${i}-cluster`}
                latitude={latitude}
                longitude={longitude}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div
                    className={classNames(
                      `text-base font-sans p-2 rounded-full  text-white flex items-center justify-center hover:scale-110 duration-75 opacity-[85%] border-2 border-stone-50`,
                      {
                        "bg-rose-600": mean === 1,
                        "bg-blue-600": mean === 2,
                        "bg-emerald-600": mean === 3,
                      }
                    )}
                    style={{
                      width: `${
                        (isVerySmallScreen ? 8 : isSmallScreen ? 5 : 3) +
                        (pointCount / reviewFeatures.length) * 3
                      }vw`,
                      height: `${
                        (isVerySmallScreen ? 8 : isSmallScreen ? 5 : 3) +
                        (pointCount / reviewFeatures.length) * 3
                      }vw`,
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id)
                      );

                      map?.flyTo({
                        center: cluster.geometry.coordinates,
                        zoom: expansionZoom,
                      });
                    }}
                  >
                    {pointCount}
                  </div>
                  {zoom == 22 && (
                    <div className="flex flex-row gap-1 items-center justify-center">
                      {sc.map((r: ReviewFeature) => (
                        <MapPinIcon
                          onClick={() => {
                            setCurrentReviewId(r.properties.id!);
                          }}
                          key={r.properties.id}
                          className={classNames(
                            "w-10 h-10  hover:scale-110 duration-75 stroke-stone-50",
                            {
                              "text-rose-600": r.properties.rating === 1,
                              "text-blue-600": r.properties.rating === 2,
                              "text-emerald-600": r.properties.rating === 3,
                            }
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Marker>
            );
          } catch (e) {
            console.log("ERROR", e);
          }
        }
        return (
          <Marker
            key={`${i}-feature`}
            latitude={latitude}
            longitude={longitude}
          >
            <MapPinIcon
              onClick={() => {
                setCurrentReviewId(cluster?.properties?.id);
              }}
              className={classNames(
                "w-10 h-10 hover:scale-110 duration-75 stroke-stone-50",
                {
                  "text-rose-600": cluster?.properties?.rating === 1,
                  "text-blue-600": cluster?.properties?.rating === 2,
                  "text-emerald-600": cluster?.properties?.rating === 3,
                }
              )}
            />
          </Marker>
        );
      })}
    </div>
  );
}

export default ReviewMarkers;
