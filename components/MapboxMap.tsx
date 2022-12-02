import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

function Geocoder() {
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
    });

    geocoder.on("result", (e) => {
      console.log(e);
    });

    map.addControl(geocoder);
    setGeo(geocoder);
  }, []);

  return <div />;
}

function MapboxMap() {
  return (
    <Map
      onClick={(e) => console.log(e)}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: "100%", height: "500px" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <Geocoder />
    </Map>
  );
}

export default MapboxMap;
