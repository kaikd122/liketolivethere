import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { towns } from "@prisma/client";

import React, { useEffect, useState } from "react";
import TownReviewsList from "../components/TownReviewsList";
import Button from "../components/ui/Button";
import { getTownsByTextRequest } from "../lib/actions/search";
import uzeStore from "../lib/store/store";
import { getPostcodeOutcode } from "../lib/util/map-utils";
import { useDebounce } from "use-lodash-debounce";
import { BeatLoader } from "react-spinners";
import Link from "next/link";
import { getTownUrl } from "../lib/util/urls";

function TownsContainer() {
  const currentTab = uzeStore((state) => state.currentTab);
  const { setCurrentTownId, setCurrentTownReviews } = uzeStore(
    (state) => state.actions
  );
  const [val, setVal] = useState("");
  const currentTownId = uzeStore((state) => state.currentTownId);
  const [results, setResults] = useState<Array<Partial<towns>>>([]);

  const [searchStatus, setSearchStatus] = useState<
    "NO_RESULTS" | "RESULTS" | "LOADING"
  >("NO_RESULTS");

  const debouncedVal = useDebounce(val, 500);

  useEffect(() => {
    if (!debouncedVal) {
      setResults([]);
      setSearchStatus("NO_RESULTS");
      return;
    }
    setSearchStatus("LOADING");
    getTownsByTextRequest({ data: { text: debouncedVal } })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setResults(data);
          if (data && data.length > 0) {
            setSearchStatus("RESULTS");
          } else {
            setSearchStatus("NO_RESULTS");
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [debouncedVal]);

  if (currentTab !== "TOWNS") {
    return null;
  }

  return (
    <div className="flex flex-col   px-3 md:px-0 ">
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
        <label className="text-stone-700 text-sm " htmlFor="search-towns-input">
          <div className="flex flex-row gap-1">
            <span className="italic">
              Enter either a town name or the first part of a postcode
            </span>
          </div>
        </label>
        <div className="flex flex-row gap-4 w-full md:w-3/4 justify-between">
          <input
            id="search-towns-input"
            className="border rounded border-stone-400   outline-violet-300 p-2 shadow-sm w-full"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="e.g. Wimbledon, Putney, SW19, SW15"
          />

          <Button
            type="submit"
            outlineColor="stone"
            border="thin"
            className="flex flex-row gap-1 items-center justify-center"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <p>Search</p>
          </Button>
        </div>
      </form>
      <div className="flex flex-col w-1/2 gap-2 py-4 ">
        {results.map((result) => {
          return (
            <Link href={`/${getTownUrl(result)}`}>
              <Button
                className="flex flex-row justify-between items-center w-full md:w-1/4 "
                smallScale
                outlineColor="stone"
                key={`townresult-${result.id}`}
                border="thin"
                onClick={async () => {
                  setResults([]);
                  setCurrentTownId(result.id!);
                  setVal("");
                }}
              >
                <p>{result.name}</p>
                <p>{getPostcodeOutcode(result.postcode_sector)}</p>
              </Button>
            </Link>
          );
        })}
        {searchStatus === "NO_RESULTS" && debouncedVal && (
          <p className="text-stone-700 text-base">No results found</p>
        )}
        {searchStatus === "LOADING" && (
          <BeatLoader color={"#a743e4"} size={15} />
        )}
      </div>
    </div>
  );
}

export default TownsContainer;
