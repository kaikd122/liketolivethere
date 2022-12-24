import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { Review, towns } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import TownReviewsList from "../components/TownReviewsList";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { getReviewsNearTownRequest } from "../lib/actions/review";
import { getTownsByTextRequest } from "../lib/actions/search";
import uzeStore from "../lib/store/store";
import { getPostcodeOutcode } from "../lib/util/map-utils";
import getReviewsNearTown from "../pages/api/getReviewsNearTown";
import getTownsByText from "../pages/api/getTownsByText";

function TownsContainer() {
  const currentTab = uzeStore((state) => state.currentTab);
  const { setCurrentTownId, setCurrentTownReviews } = uzeStore(
    (state) => state.actions
  );
  const [val, setVal] = useState("");
  const currentTownId = uzeStore((state) => state.currentTownId);
  const [results, setResults] = useState<Array<Partial<towns>>>([]);
  const [initialReviews, setInitialReviews] = useState<Partial<Review>[]>([]);

  if (currentTab !== "TOWNS") {
    return null;
  }

  return (
    <div className="flex flex-col   px-3 md:px-0 ">
      {!currentTownId ? (
        <>
          <form
            className="flex flex-col w-full align-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              getTownsByTextRequest({ data: { text: val } })
                .then(async (res) => {
                  const data = await res.json();
                  if (res.ok) {
                    setResults(data);
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            <label
              className="text-stone-700 text-sm italic"
              htmlFor="search-towns-input"
            >
              Enter either a town name or the first part of a postcode
            </label>
            <div className="flex flex-row gap-4 w-full md:w-3/4 justify-between">
              <input
                id="search-towns-input"
                className="border rounded border-stone-400   outline-violet-300 p-2 shadow-sm w-full"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="e.g. Wimbledon, Putney, SW19, SW15"
              />

              <Button type="submit" outlineColor="stone" border="thin">
                Search
              </Button>
            </div>
          </form>
          <div className="flex flex-col w-1/2 gap-2 py-4 ">
            {results.map((result) => {
              return (
                <Button
                  className="flex flex-row justify-between items-center w-full md:w-1/4 "
                  outlineColor="stone"
                  key={`townresult-${result.id}`}
                  border="thin"
                  onClick={async () => {
                    setResults([]);
                    setCurrentTownId(result.id!);
                    setVal("");
                    try {
                      const res = await getReviewsNearTownRequest({
                        data: { townId: result.id! },
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setInitialReviews(data);
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <p>{result.name}</p>
                  <p>{getPostcodeOutcode(result.postcode_sector)}</p>
                </Button>
              );
            })}
          </div>
        </>
      ) : (
        <div>
          <Button
            outlineColor="stone"
            border="thin"
            className="flex flex-row gap-2 h-8 justify-center items-center"
            onClick={() => {
              setCurrentTownId(undefined);
              setInitialReviews([]);
            }}
          >
            <ArrowUturnLeftIcon className="h-6 w-6" />
            <p>Back to town search</p>
          </Button>
        </div>
      )}
      {initialReviews.length > 0 && (
        <>
          <TownReviewsList initialReviews={initialReviews} />
        </>
      )}
    </div>
  );
}

export default TownsContainer;
