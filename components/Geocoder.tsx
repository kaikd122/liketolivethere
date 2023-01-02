import MapboxGeocoder, { Result } from "@mapbox/mapbox-gl-geocoder";
import { Review, towns } from "@prisma/client";
import mapboxgl from "mapbox-gl";
import { useState, useEffect } from "react";
import { useMap } from "react-map-gl";
import { getReviewsWithinMapBoundsRequest } from "../lib/actions/review";
import { getNearbyTownsRequest } from "../lib/actions/search";
import uzeStore from "../lib/store/store";
import { coordsArrayToObject } from "../lib/util/map-utils";
import { reviewsToFeatures } from "../lib/util/review-utils";
import { Coordinates, kingsCrossCoords } from "../types/types";

export interface GeocoderProps {
  setNearbyTowns: (towns: Array<Partial<towns>>) => void;
}

export function Geocoder(props: GeocoderProps) {
  const { current: map } = useMap();
  const [geo, setGeo] = useState<MapboxGeocoder | null>(null);
  const { setViewOnMapSource } = uzeStore((state) => state.actions);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (geo) {
      return;
    }

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      zoom: 16,
      minLength: 3,
      marker: false,
      flyTo: {
        speed: 2,
        zoom: 14,
      },
      countries: "GB",
    });

    geocoder.on("result", (e) => {
      console.log("RESULT");

      setViewOnMapSource({
        id: "geo-result",
        type: "GEO",
      });
    });

    map.addControl(geocoder);
    setGeo(geocoder);
  }, []);

  return <div />;
}
