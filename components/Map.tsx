import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Control } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker, useMap } from "react-map-gl";

import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import {
  ArrowUturnLeftIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { getNearbyTownsRequest } from "../lib/actions/search";
import { Review, towns } from "@prisma/client";
import CoordinatesDisplay from "./CoordinatesDisplay";
import ReviewMarkers from "./ReviewMarkers";
import {
  getRandomReviewRequest,
  getReviewsNearTownRequest,
  getReviewsWithinMapBoundsRequest,
} from "../lib/actions/review";
import FlyTo from "./FlyTo";
import { Geocoder } from "./Geocoder";
import {
  reviewFeaturesToDetails,
  reviewsToFeatures,
} from "../lib/util/review-utils";
import ReviewStats from "./ReviewStats";
import ZoomControl from "./ZoomControl";
import { RxShuffle } from "react-icons/rx";
import classNames from "classnames";

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
    setCurrentTownId,
    setViewOnMapSource,
    setEditReviewId,
  } = uzeStore((state) => state.actions);
  const currentTab = uzeStore((state) => state.currentTab);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const [nearbyTowns, setNearbyTowns] = useState<Array<Partial<towns>>>([]);
  const isDragging = uzeStore((state) => state.isDragging);
  const isMapViewUnsearched = uzeStore((state) => state.isMapViewUnsearched);
  const zoom = uzeStore((state) => state.zoom);
  const bounds = uzeStore((state) => state.bounds);
  const user = uzeStore((state) => state.user);
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

  useEffect(() => {
    const getNearbyTowns = async () => {
      getNearbyTownsRequest({
        data: {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          limit: 5,
        },
      }).then(async (res) => {
        const data = await res.json();
        setNearbyTowns(data);
      });
    };

    getNearbyTowns();
  }, [coordinates]);

  return (
    <div className={`flex flex-col ${currentTab === "MAP" ? "" : "hidden"}`}>
      <div
        ref={mapRef}
        className={`flex flex-col  items-center justify-center h-500 border ${
          isCreatingReview ? "border-petal border-2" : "border-stone-400"
        } max-h-[50vh] md:max-h-[100vh] rounded shadow`}
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
            setReviewFeatures(reviewsToFeatures(data));
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
            } else {
              setZoom(e.viewState.zoom);
              // setBounds(e.target.getBounds().toArray().flat());
              const map = e.target;
              map.flyTo({
                center: [coordinates.lng, coordinates.lat],
                zoom: zoom,
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
            } else {
              setZoom(e.viewState.zoom);
              setBounds(e.target.getBounds().toArray().flat());
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

                setIsDragging(false);
              }}
              style={{ zIndex: "30" }}
            >
              <MapPinIcon className="w-12 h-12 text-petal active:scale-90 hover:scale-110 duration-75 stroke-stone-50 " />
            </Marker>
          )}
          <ReviewMarkers bounds={bounds} zoom={zoom} />
          <FlyTo />
          <ZoomControl />

          <Geocoder
            setCoordinates={setCoordinates}
            coordinates={coordinates}
            setNearbyTowns={setNearbyTowns}
          />
          {isMapViewUnsearched && (
            <button
              className="border shadow-sm border-stone-400 py-1 px-2 border-1 rounded text-lg active:scale-100 duration-75 hover:scale-105 absolute bottom-2 left-[50%] translate-x-[-50%] items-center justify-center flex flex-row gap-1 bg-stone-50 font-sans text-stone-700"
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

                setReviewFeatures(reviewsToFeatures(data));
              }}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <p>Search here</p>
            </button>
          )}
        </Map>
      </div>
      {coordinates?.lat && coordinates?.lng ? (
        <div className="pt-3 flex flex-row justify-between items-center px-3 md:px-0 flex-wrap gap-2">
          <CoordinatesDisplay
            preText={`${
              isCreatingReview ? "Review coordinates:" : "Centre coordinates:"
            }`}
            className="text-base gap-1"
            iconSize="SMALL"
          />
          <div className="flex flex-row gap-3">
            <Button
              outlineColor="petal"
              border="thin"
              className="flex flex-row gap-2 items-center justify-center"
              onClick={async () => {
                try {
                  const res = await getRandomReviewRequest();
                  if (res.ok) {
                    const jsonRes: Review[] = await res.json();
                    const randomReview = jsonRes[0];

                    console.log(randomReview.latitude, randomReview.longitude);
                    setIsCreatingReview(false);
                    setCoordinates({
                      lat: Number(randomReview.latitude),
                      lng: Number(randomReview.longitude),
                    });
                    setViewOnMapSource({
                      type: "REVIEW",
                      id: randomReview.id,
                    });
                    setIsMapViewUnsearched(false);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <RxShuffle />
              <p>Random review</p>
            </Button>
            {!isCreatingReview ? (
              <Button
                outlineColor="petal"
                border="thin"
                onClick={() => {
                  setIsCreatingReview(true);
                }}
                className="flex flex-row gap-1"
              >
                <PencilSquareIcon className="w-5 h-5 items-center justify-center" />
                <p> Write a review</p>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setIsCreatingReview(false);
                  setEditReviewId("");
                }}
                outlineColor="petal"
                border="thin"
                className="flex flex-row gap-1 items-center justify-center"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                <p>Return to explore mode</p>
              </Button>
            )}{" "}
          </div>
        </div>
      ) : null}

      <div className="flex flex-row  gap-4 flex-wrap px-3 md:px-0 pt-3">
        {nearbyTowns.map((town) => {
          return (
            <Button
              bgColor="petalGradient"
              outlineColor="light"
              border="none"
              key={town.id}
              className="text-sm"
              onClick={async () => {
                setCurrentTab("TOWNS");
                setCurrentTownId(town.id!);

                // replaceUrl(getTownUrl(town));
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
