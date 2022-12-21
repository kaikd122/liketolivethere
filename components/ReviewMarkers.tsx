import { Review } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import uzeStore from "../lib/store/store";

function ReviewMarkers() {
  const { current: map } = useMap();
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);
  const [reviews, setReviews] = useState<Array<Partial<Review>>>([]);

  useEffect(() => {
    if (!isMapLoaded) {
      return;
    }
  }, [isMapLoaded]);

  return <div>ReviewMarkers</div>;
}

export default ReviewMarkers;
