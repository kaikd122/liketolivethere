import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import React, { useContext } from "react";
import { useMap } from "react-map-gl";
import { MapContext } from "../lib/context/MapContext";

function ZoomControl() {
  const { map } = useContext(MapContext);

  if (!map) {
    return null;
  }

  return (
    <div className="absolute top-16 right-2 flex flex-col gap-2">
      <button
        className="border shadow-sm border-stone-400 p-1 bg-stone-50 rounded text-base active:scale-100 duration-75 hover:scale-105"
        onClick={() => {
          map.zoomIn();
        }}
      >
        <PlusIcon className="h-5 w-5 " />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="border shadow-sm border-stone-400 p-1 bg-stone-50 rounded text-base active:scale-100 duration-75 hover:scale-105"
      >
        <MinusIcon className="h-5 w-5 " />
      </button>
    </div>
  );
}

export default ZoomControl;
