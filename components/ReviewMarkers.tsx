import { MapPinIcon } from "@heroicons/react/24/solid";
import { Review } from "@prisma/client";

import React from "react";
import { Marker, useMap, LayerProps, Source, Layer } from "react-map-gl";
import uzeStore from "../lib/store/store";
import useSupercluster from "use-supercluster";
import { ReviewFeature } from "../types/types";
import classNames from "classnames";

export interface ReviewMarkersProps {
  bounds: Array<number>;
  zoom: number;
}

function ReviewMarkers({ bounds, zoom }: ReviewMarkersProps) {
  const { current: map } = useMap();
  const reviewFeatures = uzeStore((state) => state.reviewFeatures);

  const { clusters, supercluster } = useSupercluster({
    points: reviewFeatures,
    bounds: bounds as unknown as [number, number, number, number],
    zoom,
    options: { radius: 75, maxZoom: 22 },
  });

  return (
    <div className="w-full h-full ">
      {clusters.map((cluster, i) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          const sc = supercluster.getLeaves(cluster.id, Infinity);

          const num = sc.reduce(
            (acc: number, cur: ReviewFeature) =>
              acc + (cur?.properties?.rating || 2),
            0
          );

          const mean = Math.round(num / sc.length);
          console.log(mean);

          return (
            <Marker
              key={`${i}-cluster`}
              latitude={latitude}
              longitude={longitude}
            >
              <div
                className={classNames(
                  "text-xl rounded-full  text-white flex items-center justify-center hover:scale-105 duration-75 opacity-[85%]",
                  {
                    "bg-rose-400": mean === 1,
                    "bg-blue-400": mean === 2,
                    "bg-emerald-400": mean === 3,
                  }
                )}
                style={{
                  width: `${3 + (pointCount / reviewFeatures.length) * 2}vw`,
                  height: `${3 + (pointCount / reviewFeatures.length) * 2}vw`,
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
            </Marker>
          );
        }
        return (
          <Marker
            key={`${i}-feature`}
            latitude={latitude}
            longitude={longitude}
          >
            <MapPinIcon
              className={classNames("w-7 h-7 hover:scale-110 duration-75", {
                "text-rose-400": cluster?.properties?.rating === 1,
                "text-blue-400": cluster?.properties?.rating === 2,
                "text-emerald-400": cluster?.properties?.rating === 3,
              })}
            />
          </Marker>
        );
      })}
    </div>
  );
}

export default ReviewMarkers;
