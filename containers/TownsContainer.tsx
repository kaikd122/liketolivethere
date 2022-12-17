import React from "react";
import Card from "../components/ui/Card";
import { getTownsByTextRequest } from "../lib/actions/search";
import uzeStore from "../lib/store/store";
import getTownsByText from "../pages/api/getTownsByText";

function TownsContainer() {
  const currentTab = uzeStore((state) => state.currentTab);
  if (currentTab !== "TOWNS") {
    return null;
  }

  const [val, setVal] = React.useState("");

  return (
    <div className="flex flex-col">
      <label className="text-stone-400" htmlFor="search-towns-input">
        Enter a town name or the first part of a postcode, and press enter enter
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getTownsByTextRequest({ data: { text: val } }).then(async (res) => {
            const data = await res.json();
            console.log(data);
          });
        }}
      >
        <input
          id="search-towns-input"
          className="border rounded border-stone-300 md:w-3/4 w-full  outline-violet-300 p-2 shadow-sm"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button type="submit" />
      </form>
    </div>
  );
}

export default TownsContainer;
