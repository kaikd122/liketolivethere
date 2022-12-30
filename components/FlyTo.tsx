import { Review } from "@prisma/client";
import { useEffect } from "react";
import { useMap } from "react-map-gl";
import { getReviewsWithinMapBoundsRequest } from "../lib/actions/review";
import uzeStore from "../lib/store/store";
import { reviewsToFeatures } from "../lib/util/review-utils";

export default function FlyTo() {
  const { current: map } = useMap();
  const {
    setIsMapViewUnsearched,
    setZoom,
    setBounds,
    setViewOnMapSource,
    setCurrentReviewId,
    setReviewFeatures,
  } = uzeStore((state) => state.actions);
  const isMapViewUnsearched = uzeStore((state) => state.isMapViewUnsearched);
  const coordinates = uzeStore((state) => state.coordinates);
  const zoom = uzeStore((state) => state.zoom);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const viewOnMapSource = uzeStore((state) => state.viewOnMapSource);
  const bounds = uzeStore((state) => state.bounds);
  const editReviewId = uzeStore((state) => state.editReviewId);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (isMapViewUnsearched === false) {
      setIsMapViewUnsearched(true);
    }
    console.log("BOUNDS", bounds);
    setBounds(map.getBounds().toArray().flat());
    setZoom(map.getZoom());

    if (isCreatingReview || viewOnMapSource) {
      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: zoom,
      });
    }
    if (viewOnMapSource) {
      setReviewFeatures([]);
      map.once("moveend", async () => {
        setIsMapViewUnsearched(false);
        const tempBounds = map.getBounds().toArray().flat();

        const res = await getReviewsWithinMapBoundsRequest({
          data: {
            bounds: {
              sw: {
                lat: tempBounds[1],
                lng: tempBounds[0],
              },
              ne: {
                lat: tempBounds[3],
                lng: tempBounds[2],
              },
            },
            coordinates: {
              lat: coordinates.lat,
              lng: coordinates.lng,
            },
          },
        });
        const data: Partial<Review>[] = await res.json();
        setReviewFeatures(
          reviewsToFeatures(data).filter(
            (r) => r.properties.id !== editReviewId
          )
        );

        viewOnMapSource.type === "REVIEW" &&
          setCurrentReviewId(viewOnMapSource.id);
        setViewOnMapSource(null);
      });
    }
  }, [coordinates, zoom]);

  return null;
}
