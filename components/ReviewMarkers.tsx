import { MapPinIcon } from "@heroicons/react/24/solid";
import { Review } from "@prisma/client";

import React from "react";
import { Marker, useMap, LayerProps, Source, Layer } from "react-map-gl";
import uzeStore from "../lib/store/store";
import useSupercluster from "use-supercluster";

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
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          return (
            <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
              <div
                className={`text-[xl] rounded-full bg-petalLight text-white flex items-center justify-center 
                hover:scale-105 duration-75`}
                style={{
                  width: `${3 + (pointCount / reviewFeatures.length) * 5}vw`,
                  height: `${3 + (pointCount / reviewFeatures.length) * 5}vw`,
                }}
                onClick={() => {
                  const d = supercluster.getLeaves(cluster.id, Infinity);
                  console.log(d);
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
          <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
            <MapPinIcon className="w-5 h-5 text-petal active:scale-90 duration-75 " />
          </Marker>
        );
      })}
    </div>
  );
}

export default ReviewMarkers;
