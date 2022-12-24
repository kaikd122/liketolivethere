import MapboxGeocoder, { Result } from "@mapbox/mapbox-gl-geocoder";
import { towns } from "@prisma/client";
import mapboxgl from "mapbox-gl";
import { useState, useEffect } from "react";
import { useMap } from "react-map-gl";
import { getNearbyTownsRequest } from "../lib/actions/search";
import { coordsArrayToObject } from "../lib/util/map-utils";
import { Coordinates, kingsCrossCoords } from "../types/types";

export interface GeocoderProps {
  setCoordinates: (coordinates: Coordinates) => void;
  coordinates: Coordinates;
  setNearbyTowns: (towns: Array<Partial<towns>>) => void;
}

export function Geocoder(props: GeocoderProps) {
  const { current: map } = useMap();
  const [geo, setGeo] = useState<MapboxGeocoder | null>(null);

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
        zoom: 16,
      },
      countries: "GB",
    });

    //for initial load
    getNearbyTownsRequest({
      data: {
        latitude: kingsCrossCoords.lat,
        longitude: kingsCrossCoords.lng,
        limit: 5,
      },
    }).then(async (res) => {
      const data = await res.json();
      props.setNearbyTowns(data);
    });

    geocoder.on("result", (e) => {
      const result: Result = e.result;
      const coords = coordsArrayToObject(result.geometry.coordinates);
      props.setCoordinates(coords);
      getNearbyTownsRequest({
        data: {
          latitude: coords.lat,
          longitude: coords.lng,
          limit: 5,
        },
      }).then(async (res) => {
        const data = await res.json();
        props.setNearbyTowns(data);
      });
    });

    map.addControl(geocoder);
    setGeo(geocoder);
  }, []);

  return <div />;
}
