import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";
import MapboxGeocoder, { Result } from "@mapbox/mapbox-gl-geocoder";
import { Coordinates, kingsCrossCoords } from "../types/types";
import { coordsArrayToObject } from "../lib/util/map-utils";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import { MapPinIcon } from "@heroicons/react/24/solid";
import getNearbyTowns from "../pages/api/getNearbyTowns";
import { getNearbyTownsRequest } from "../lib/actions/search";
import { towns } from "@prisma/client";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

export interface GeocoderProps {
  setCoordinates: (coordinates: Coordinates) => void;
  coordinates: Coordinates;
  setNearbyTowns: (towns: Array<Partial<towns>>) => void;
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

function MapContainer() {
  const coordinates = uzeStore((state) => state.coordinates);
  const { setCoordinates, setIsCreatingReview, setIsDragging } = uzeStore(
    (state) => state.actions
  );
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const [nearbyTowns, setNearbyTowns] = useState<Array<Partial<towns>>>([]);

  useEffect(() => {
    console.log("coordinates", coordinates);
  }, [JSON.stringify(coordinates)]);

  return (
    <div className="flex flex-col ">
      <div
        className={`flex flex-col items-center justify-center h-500 border border-stone-300  md:rounded shadow ${
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
            <MapPinIcon className="w-10 h-10 text-petal" />
          </Marker>

          <Geocoder
            setCoordinates={setCoordinates}
            coordinates={coordinates}
            setNearbyTowns={setNearbyTowns}
          />
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
      <div className="flex flex-row pt-4 gap-4 flex-wrap">
        {nearbyTowns.map((town) => {
          return (
            <Button
              bgColor="petalGradient"
              outlineColor="light"
              borderThickness="none"
              key={town.id}
            >
              {town.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default MapContainer;
