import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";
import MapboxGeocoder, { Result } from "@mapbox/mapbox-gl-geocoder";
import { Coordinates } from "../types/types";
import { coordsArrayToObject } from "../lib/util/map-utils";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

export interface GeocoderProps {
  setCoordinates: (coordinates: Coordinates) => void;
  coordinates: Coordinates;
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
      minLength: 3,
      marker: false,
      flyTo: {
        speed: 2,
      },
      countries: "GB,US",
    });

    geocoder.on("result", (e) => {
      const result: Result = e.result;
      props.setCoordinates(coordsArrayToObject(result.geometry.coordinates));
      console.log(result);
    });

    map.addControl(geocoder);
    setGeo(geocoder);
  }, []);

  return <div />;
}

function MapContainer() {
  const coordinates = uzeStore((state) => state.coordinates);
  const { setCoordinates, setIsCreatingReview, setIsDragging } = uzeStore(
    (state) => state.actions
  );
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);

  useEffect(() => {
    console.log("coordinates", coordinates);
  }, [JSON.stringify(coordinates)]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-500 border border-stone-300 md:rounded shadow ${
        currentTab === "MAP" ? "" : "hidden"
      }`}
    >
      <Map
        onClick={(e) => console.log(e)}
        initialViewState={{
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          zoom: 14,
        }}
        style={{
          width: "100%",
          height: "500px",
          overflow: "hidden",
          borderRadius: "0.25rem",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker
          longitude={coordinates.lng}
          latitude={coordinates.lat}
          anchor="bottom"
          draggable={true}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={(e) => {
            const lngLat = e.lngLat;
            setCoordinates({
              lng: lngLat.lng,
              lat: lngLat.lat,
            });
            setIsDragging(false);
          }}
        >
          <img src="./mapbox-marker-icon-20px-purple.png" />
        </Marker>

        <Geocoder setCoordinates={setCoordinates} coordinates={coordinates} />
        {!isCreatingReview && (
          <Button
            onClick={() => setIsCreatingReview(true)}
            bgColor="light"
            outlineColor="stone"
            borderThickness="thin"
            className=" absolute bottom-8 right-4 font-sans text-sm"
          >
            + Create review
          </Button>
        )}
      </Map>
    </div>
  );
}

export default MapContainer;
