import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Control } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";
import MapboxGeocoder, { Result } from "@mapbox/mapbox-gl-geocoder";
import { Coordinates, kingsCrossCoords, ReviewFeature } from "../types/types";
import { coordsArrayToObject } from "../lib/util/map-utils";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import { MapPinIcon, PlusIcon } from "@heroicons/react/24/solid";
import getNearbyTowns from "../pages/api/getNearbyTowns";
import { getNearbyTownsRequest } from "../lib/actions/search";
import { Review, towns } from "@prisma/client";
import classNames from "classnames";
import CoordinatesDisplay from "./CoordinatesDisplay";
import Link from "next/link";
import { useRouter } from "next/router";
import { getTownUrl, replaceUrl } from "../lib/util/urls";
import ReviewMarkers from "./ReviewMarkers";
import { getReviewsWithinMapBoundsRequest } from "../lib/actions/review";
import { map } from "leaflet";
import FlyTo from "./FlyTo";
import { Geocoder } from "./GeoCoder";
import { reviewFeaturesToDetails } from "../lib/util/review-utils";
import ReviewStats from "./ReviewStats";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

function MapContainer() {
  const coordinates = uzeStore((state) => state.coordinates);
  const {
    setCoordinates,
    setIsCreatingReview,
    setIsDragging,
    setCurrentTab,
    setIsMapLoaded,
    setReviewFeatures,
    setIsMapViewUnsearched,
    setZoom,
    setBounds,
  } = uzeStore((state) => state.actions);
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const [nearbyTowns, setNearbyTowns] = useState<Array<Partial<towns>>>([]);
  const isDragging = uzeStore((state) => state.isDragging);
  const isMapViewUnsearched = uzeStore((state) => state.isMapViewUnsearched);
  const zoom = uzeStore((state) => state.zoom);
  const bounds = uzeStore((state) => state.bounds);
  const reviewFeatures = uzeStore((state) => state.reviewFeatures);

  const mapRef = useRef(null);
  const executeScroll = () => {
    //@ts-ignore
    mapRef?.current && mapRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isCreatingReview) {
      executeScroll();
    }
  }, [isCreatingReview]);

  return (
    <div className={`flex flex-col ${currentTab === "MAP" ? "" : "hidden"}`}>
      <div
        ref={mapRef}
        className={`flex flex-col  items-center justify-center h-500 border border-stone-300 max-h-[50vh] md:max-h-[100vh] rounded shadow`}
      >
        <Map
          onLoad={async (e) => {
            setIsMapLoaded(true);

            const map = e.target;
            const bounds = map.getBounds().toArray().flat();
            setBounds(bounds);
            setZoom(map.getZoom());

            const res = await getReviewsWithinMapBoundsRequest({
              data: {
                bounds: {
                  sw: {
                    lat: bounds[1],
                    lng: bounds[0],
                  },
                  ne: {
                    lat: bounds[3],
                    lng: bounds[2],
                  },
                },
                coordinates: {
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                },
              },
            });

            setIsMapViewUnsearched(false);

            const data: Partial<Review>[] = await res.json();
            const features = data.map((r) => ({
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
            setReviewFeatures(features);
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
          onDragStart={() => {
            if (!isCreatingReview) {
              setIsDragging(true);
            }
          }}
          onDragEnd={(e) => {
            setIsDragging(false);
            if (!isCreatingReview) {
              setCoordinates({
                lng: e.viewState.longitude,
                lat: e.viewState.latitude,
              });
            }
          }}
          onZoomStart={() => {
            if (!isCreatingReview) {
              setIsDragging(true);
            }
          }}
          onZoomEnd={(e) => {
            setIsDragging(false);
            if (!isCreatingReview) {
              setCoordinates({
                lng: e.viewState.longitude,
                lat: e.viewState.latitude,
              });
            }
          }}
        >
          {isCreatingReview && (
            <Marker
              longitude={coordinates.lng}
              latitude={coordinates.lat}
              draggable={true}
              anchor="bottom"
              onDragStart={() => {
                setIsDragging(true);
              }}
              onDragEnd={(e) => {
                const lngLat = e.lngLat;
                setCoordinates({
                  lng: lngLat.lng,
                  lat: lngLat.lat,
                });

                //need to get bounds

                getNearbyTownsRequest({
                  data: {
                    latitude: lngLat.lat,
                    longitude: lngLat.lng,
                    limit: 5,
                  },
                }).then(async (res) => {
                  const data = await res.json();
                  setNearbyTowns(data);
                });
                setIsDragging(false);
              }}
              style={{ zIndex: "99" }}
            >
              <MapPinIcon className="w-10 h-10 text-petal active:scale-90 duration-75 " />
            </Marker>
          )}
          <ReviewMarkers bounds={bounds} zoom={zoom} />
          <FlyTo />

          <Geocoder
            setCoordinates={setCoordinates}
            coordinates={coordinates}
            setNearbyTowns={setNearbyTowns}
          />
          {isMapViewUnsearched && (
            <button
              className="border shadow-sm border-stone-400 p-2 rounded  active:scale-100 duration-75 hover:scale-105 absolute bottom-2 left-[50%] translate-x-[-50%]  bg-stone-50 font-sans text-sm text-stone-700"
              onClick={async () => {
                const res = await getReviewsWithinMapBoundsRequest({
                  data: {
                    bounds: {
                      sw: {
                        lat: bounds[1],
                        lng: bounds[0],
                      },
                      ne: {
                        lat: bounds[3],
                        lng: bounds[2],
                      },
                    },
                    coordinates: {
                      lat: coordinates.lat,
                      lng: coordinates.lng,
                    },
                  },
                });

                setIsMapViewUnsearched(false);

                const data: Partial<Review>[] = await res.json();
                const features = data.map((r) => ({
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
                setReviewFeatures(features);
              }}
            >
              Search here
            </button>
          )}
        </Map>
      </div>
      {coordinates?.lat && coordinates?.lng ? (
        <div className="pt-3 flex flex-row justify-between items-center px-3 md:px-0">
          <CoordinatesDisplay
            preText={`${
              isCreatingReview ? "Review coordinates:" : "Centre coordinates:"
            }`}
            className="text-base gap-1"
          />
          {!isCreatingReview ? (
            <Button
              outlineColor="petal"
              border="thin"
              onClick={() => {
                setIsCreatingReview(true);
              }}
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
      {!isCreatingReview && <ReviewStats />}
    </div>
  );
}

export default MapContainer;
