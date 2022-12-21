import React, { useEffect, useRef, useState } from "react";
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
import classNames from "classnames";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Link from "next/link";
import { useRouter } from "next/router";
import { getTownUrl, replaceUrl } from "../lib/util/urls";
import ReviewMarkers from "./ReviewMarkers";

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

function FlyTo() {
  const { current: map } = useMap();
  const coordinates = uzeStore((state) => state.coordinates);
  useEffect(() => {
    if (!map) {
      return;
    }

    map.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
    });
  }, [coordinates]);
  return null;
}

function MapContainer() {
  const router = useRouter();
  const coordinates = uzeStore((state) => state.coordinates);
  const {
    setCoordinates,
    setIsCreatingReview,
    setIsDragging,
    setCurrentTab,
    setIsMapLoaded,
  } = uzeStore((state) => state.actions);
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const [nearbyTowns, setNearbyTowns] = useState<Array<Partial<towns>>>([]);
  const isDragging = uzeStore((state) => state.isDragging);

  const mapRef = useRef(null);
  const executeScroll = () => {
    //@ts-ignore
    mapRef?.current && mapRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("coordinates", coordinates);
  }, [JSON.stringify(coordinates)]);

  useEffect(() => {
    if (!isCreatingReview) {
      executeScroll();
    }
  }, [isCreatingReview]);

  return (
    <div className={`flex flex-col ${currentTab === "MAP" ? "" : "hidden"}`}>
      <div
        ref={mapRef}
        className={`flex flex-col items-center justify-center h-500 border border-stone-300 max-h-[50vh] md:max-h-[100vh] rounded shadow`}
      >
        <Map
          onLoad={() => {
            setIsMapLoaded(true);
          }}
          onClick={(e) => {
            if (!isDragging) {
              return;
            }
            const lngLat = e.lngLat;
            setCoordinates({
              lng: lngLat.lng,
              lat: lngLat.lat,
            });
            setIsDragging(false);
          }}
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
            <MapPinIcon className="w-10 h-10 text-petal active:scale-90 duration-75 " />
          </Marker>
          <ReviewMarkers />
          <FlyTo />

          <Geocoder
            setCoordinates={setCoordinates}
            coordinates={coordinates}
            setNearbyTowns={setNearbyTowns}
          />
        </Map>
      </div>
      {coordinates?.lat && coordinates?.lng ? (
        <div className="py-3 flex flex-row justify-between items-center px-3 md:px-0">
          <CoordinatesDisplay preText="Lat lng:" className="text-base gap-1" />
          {!isCreatingReview ? (
            <Button
              outlineColor="petal"
              border="thin"
              onClick={() => setIsCreatingReview(true)}
            >
              Write a review
            </Button>
          ) : (
            <div />
          )}
        </div>
      ) : null}
      <div className="flex flex-row  gap-4 flex-wrap px-3 md:px-0 py-1">
        {nearbyTowns.map((town) => {
          return (
            <Button
              bgColor="petalGradient"
              outlineColor="light"
              border="none"
              key={town.id}
              className="text-sm"
              onClick={() => {
                setCurrentTab("TOWNS");
                replaceUrl(getTownUrl(town));
              }}
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
