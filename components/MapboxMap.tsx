import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
console.log("hi", process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
function MapboxMap() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);
  return (
    <div ref={mapContainer} className="h-96">
      MapboxMap
    </div>
  );
}

export default MapboxMap;
