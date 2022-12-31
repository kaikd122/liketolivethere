import { Review, towns } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { getReviewsNearTownRequest } from "../lib/actions/review";
import {
  getNearbyTownsRequest,
  getTownByIdRequest,
} from "../lib/actions/search";
import { TOWN_REVIEWS_PAGE_SIZE } from "../lib/constants";
import uzeStore from "../lib/store/store";
import { onlyUnique } from "../lib/util/general";
import { getPostcodeOutcode } from "../lib/util/map-utils";
import CoordinatesDisplay from "./CoordinatesDisplay";
import ReviewStub from "./ReviewStub";
import Button from "./ui/Button";
import ViewOnMapButton from "./ViewOnMapButton";

export interface TownReviewsListProps {
  serverSideReviews?: ReviewWithDistance[];
  serverSideTown?: Partial<towns>;
  serverSideNearbyTowns?: Array<Partial<towns>>;
  serverSideIsAllCurrentTownReviewsLoaded?: boolean;
}

export interface ReviewWithDistance extends Partial<Review> {
  distance: number | undefined;
}

function TownReviewsList({
  serverSideReviews,
  serverSideNearbyTowns,
  serverSideTown,
  serverSideIsAllCurrentTownReviewsLoaded,
}: TownReviewsListProps) {
  const initialReviews = serverSideReviews ?? [];
  const initialTown = serverSideTown ?? {};
  const initialNearbyTowns = serverSideNearbyTowns ?? [];
  const reviewStubs = uzeStore((state) => state.reviewStubs);
  const { setReviewStubs } = uzeStore((state) => state.actions);
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);

  const currentTownId = uzeStore((state) => state.currentTownId);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllCurrentTownReviewsLoaded, setIsAllCurrentTownReviewsLoaded] =
    useState(!!serverSideIsAllCurrentTownReviewsLoaded);

  const [town, setTown] = useState<Partial<towns>>(initialTown);
  const [nearbyTowns, setNearbyTowns] =
    useState<Array<Partial<towns>>>(initialNearbyTowns);

  const { setCurrentTownId } = uzeStore((state) => state.actions);

  useEffect(() => {
    if (!currentTownId) {
      setReviewStubs([]);
      setIsAllCurrentTownReviewsLoaded(true);
      return;
    }
    setReviewStubs(initialReviews);
    const main = async () => {
      try {
        setIsLoading(true);

        const res = await getReviewsNearTownRequest({
          data: {
            townId: currentTownId,
            offset: initialReviews.length,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length < TOWN_REVIEWS_PAGE_SIZE) {
            setIsAllCurrentTownReviewsLoaded(true);
          } else {
            setIsAllCurrentTownReviewsLoaded(false);
          }
          setReviewStubs(data);
        }

        const townRes = await getTownByIdRequest({
          data: {
            id: currentTownId,
          },
        });
        if (townRes.ok) {
          const townData = await townRes.json();
          setTown(townData);
          const nearbyRes = await getNearbyTownsRequest({
            data: {
              latitude: Number(townData?.latitude),
              longitude: Number(townData?.longitude),
              limit: 6,
            },
          });
          if (nearbyRes.ok) {
            const data: Partial<towns>[] = await nearbyRes.json();
            setNearbyTowns(data.filter((t) => t.id !== currentTownId));
            console.log(data);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    if (initialReviews.length === 0) {
      main();
    }
  }, [currentTownId]);

  if (!currentTownId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-col justify-center items-center gap-3">
        <h1 className="text-5xl">{town?.name}</h1>
        <h2 className="text-lg">
          {town?.county}, {getPostcodeOutcode(town?.postcode_sector)}
        </h2>
      </div>
      <div>
        <div className="flex flex-row justify-between items-center w-full flex-wrap gap-2">
          <CoordinatesDisplay
            iconSize="MEDIUM"
            preText=""
            className="text-xl gap-2"
            overrideCoordinates={{
              lat: Number(town?.latitude),
              lng: Number(town?.longitude),
            }}
          />
          <div className="flex flex-row gap-4 items-center justify-center ">
            <ViewOnMapButton
              withText
              town={town}
              coordinates={{
                lat: Number(town?.latitude),
                lng: Number(town?.longitude),
              }}
            />
            <ViewOnMapButton
              coordinates={{
                lat: Number(town?.latitude),
                lng: Number(town?.longitude),
              }}
              writeMode
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row  gap-4 flex-wrap  py-1 items-end">
        {nearbyTowns.map((nt) => {
          return (
            <Button
              bgColor="petalGradient"
              outlineColor="light"
              border="none"
              key={nt.id}
              className="text-sm"
              onClick={() => {
                setCurrentTownId(nt.id!);
              }}
            >
              {isMapLoaded ? nt.name : <Link href="/">{nt.name}</Link>}
            </Button>
          );
        })}
      </div>
      {reviewStubs?.length > 0 ? (
        reviewStubs
          .filter((val, i) =>
            onlyUnique(
              val.id,
              i,
              reviewStubs.map((r) => r.id)
            )
          )
          .map((review) => {
            return <ReviewStub key={`${review.id}-stub`} review={review} />;
          })
      ) : isLoading ? (
        <div className="flex justify-center items-center flex-row w-full">
          <BeatLoader color={"#a743e4"} />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row w-full">
          <span className="text-lg">
            There are no reviews within 3 kilometres
          </span>
        </div>
      )}
      {!isAllCurrentTownReviewsLoaded ? (
        <div className="flex justify-center items-center flex-row w-full">
          <Button
            outlineColor="stone"
            border="thin"
            onClick={async () => {
              try {
                const res = await getReviewsNearTownRequest({
                  data: {
                    townId: currentTownId!,
                    offset: reviewStubs.length,
                  },
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.length < TOWN_REVIEWS_PAGE_SIZE) {
                    setIsAllCurrentTownReviewsLoaded(true);
                  }
                  setReviewStubs([...reviewStubs, ...data]);
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Load more
          </Button>
        </div>
      ) : reviewStubs?.length > 0 ? (
        <div className="flex justify-center items-center flex-row w-full">
          <span className="text-lg">
            There are no more reviews within 3 kilometres
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default TownReviewsList;
