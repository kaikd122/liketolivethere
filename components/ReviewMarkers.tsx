import { MapPinIcon } from "@heroicons/react/24/solid";
import { Review } from "@prisma/client";

import React, { useEffect, useMemo, useState } from "react";
import { Marker, useMap, LayerProps, Source, Layer } from "react-map-gl";
import { getReviewsWithinMapBoundsRequest } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import useSupercluster from "use-supercluster";

export interface ReviewMarkersProps {
  bounds: Array<number>;
  zoom: number;
}

function ReviewMarkers({ bounds, zoom }: ReviewMarkersProps) {
  const { current: map } = useMap();
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);
  const [reviews, setReviews] = useState<Array<Partial<Review>>>([]);

  useEffect(() => {
    if (!isMapLoaded || !map) {
      return;
    }

    const main = async () => {
      const res = await getReviewsWithinMapBoundsRequest({
        data: {
          bounds: {
            sw: {
              lat: bounds[1],
              lng: bounds[0],
            },
            ne: {
              lat: bounds[3],
              lng: bounds[2],
            },
          },
        },
      });
      const data = await res.json();
      console.log(data);

      setReviews(data);
    };

    main();
  }, [isMapLoaded]);

  const reviewFeatures = useMemo(() => {
    return reviews.map((r) => ({
      type: "Feature",
      properties: {
        id: r.id,
        title: r.title,
        rating: r.rating,
      },
      geometry: {
        type: "Point",
        coordinates: [r.longitude, r.latitude],
      },
    }));
  }, [JSON.stringify(reviews)]);

  const { clusters, supercluster } = useSupercluster({
    points: reviewFeatures,
    bounds: bounds as unknown as [number, number, number, number],
    zoom,
    options: { radius: 10, maxZoom: 20 },
  });

  return (
    <>
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
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
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

      {/* {reviews.map((r) => (
        <Marker
          key={r.id}
          latitude={r.latitude as unknown as number}
          longitude={r.longitude as unknown as number}
        >
          <MapPinIcon className="w-10 h-10 text-petal active:scale-90 duration-75 " />
        </Marker>
      ))} */}
    </>
  );
}

export default ReviewMarkers;
