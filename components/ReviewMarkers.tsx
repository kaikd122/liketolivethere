import { MapPinIcon } from "@heroicons/react/24/solid";
import { Review } from "@prisma/client";

import React, { useEffect, useMemo, useState } from "react";
import { Marker, useMap, LayerProps, Source, Layer } from "react-map-gl";
import { getReviewsWithinMapBoundsRequest } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import getReviewsWithinMapBounds from "../pages/api/getReviewsWithinMapBounds";
import { Coordinates } from "../types/types";

function ReviewMarkers() {
  const { current: map } = useMap();
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);
  const [reviews, setReviews] = useState<Array<Partial<Review>>>([]);

  useEffect(() => {
    if (!isMapLoaded || !map) {
      return;
    }

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const main = async () => {
      const res = await getReviewsWithinMapBoundsRequest({
        data: {
          bounds: {
            sw,
            ne,
          },
        },
      });
      const data = await res.json();
      console.log(data);

      setReviews(data);
    };

    main();
  }, [isMapLoaded]);

  const reviewsFeatureCollection = useMemo(() => {
    const features = reviews.map((r) => ({
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

    return {
      type: "FeatureCollection",
      features,
    };
  }, [JSON.stringify(reviews)]);

  return (
    <>
      <Source
        cluster={true}
        id="reviews"
        type="geojson"
        data={reviewsFeatureCollection}
      >
        <Layer
          id="reviews"
          type="symbol"
          layout={{
            "icon-image": "marker-15",
            "icon-allow-overlap": true,
          }}
        />
      </Source>

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
