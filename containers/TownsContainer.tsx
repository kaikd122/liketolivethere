import { towns } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
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
  const [val, setVal] = React.useState("");
  const [results, setResults] = React.useState<Array<Partial<towns>>>([]);

  if (currentTab !== "TOWNS") {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center px-3 md:px-0 ">
      <form
        className="flex flex-col w-full align-center"
        onSubmit={(e) => {
          e.preventDefault();
          getTownsByTextRequest({ data: { text: val } })
            .then(async (res) => {
              const data = await res.json();
              setResults(data);
            })
            .catch((e) => {
              console.log(e);
            });
        }}
      >
        <label className="text-stone-400" htmlFor="search-towns-input">
          Enter a town name or the first part of a postcode
        </label>
        <div className="flex flex-row gap-4 w-full md:w-3/4 justify-between">
          <input
            id="search-towns-input"
            className="border rounded border-stone-300   outline-violet-300 p-2 shadow-sm w-full"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />

          <button type="submit">Search</button>
        </div>
      </form>
      <div className="flex flex-col w-full ">
        {results.map((result) => {
          return (
            <Button
              className="flex flex-row justify-between items-center w-full md:w-3/4"
              onClick={() => {
                getReviewsNearTownRequest({ data: { townId: result.id! } })
                  .then(async (res) => {
                    const data = await res.json();
                    console.log(data);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
            >
              <p>{result.name}</p>
              <p>{getPostcodeOutcode(result.postcode_sector)}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default TownsContainer;
