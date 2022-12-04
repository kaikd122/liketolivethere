import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";
import MapboxGeocoder, { Result, Results } from "@mapbox/mapbox-gl-geocoder";
import { Coordinates, kingsCrossCoords } from "../types/types";
import { coordsArrayToObject } from "../lib/util/map-utils";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

export interface GeocoderProps {
  setCenterCoords: React.Dispatch<React.SetStateAction<Coordinates>>;
  centerCoords: Coordinates;
}

function Geocoder(props: GeocoderProps) {
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
      minLength: 4,
      marker: false,
      flyTo: {
        speed: 2,
      },
      countries: "GB,US",
    });

    geocoder.on("result", (e) => {
      const result: Result = e.result;
      props.setCenterCoords(coordsArrayToObject(result.geometry.coordinates));
      console.log(result.geometry);
    });

    map.addControl(geocoder);
    setGeo(geocoder);
  }, []);

  return <div />;
}

function MapboxMap() {
  const [centerCoords, setCenterCoords] =
    useState<Coordinates>(kingsCrossCoords);
  return (
    <>
      <button onClick={() => console.log(centerCoords)}>hi</button>
      <Map
        onClick={(e) => console.log(e)}
        initialViewState={{
          longitude: centerCoords.lng,
          latitude: centerCoords.lat,
          zoom: 14,
        }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker
          longitude={centerCoords.lng}
          latitude={centerCoords.lat}
          anchor="bottom"
        >
          <img src="./mapbox-marker-icon-20px-blue.png" />
        </Marker>
        <Geocoder
          setCenterCoords={setCenterCoords}
          centerCoords={centerCoords}
        />
      </Map>
    </>
  );
}

export default MapboxMap;
