import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { useMap } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

class Poop extends MapboxGeocoder {
    constructor(){
        super()
        this.justSearched = false;
        this.setJustSearched = ()=>void;
        
    }
  justSearched: boolean;
  setJustSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

function Geocoder() {
  const [justSearched, setJustSearched] = useState(false);
  const { current: map } = useMap();
  const [geocoder, setGeocoder] = useState<MapboxGeocoder | null>(null);
  useEffect(() => {
    if (!map) {
      return;
    }
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      zoom: 16,
      minLength: 0,
    });

    geocoder._onKeyDown = (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === "Enter") {
        console.log(e.target.value);
        geocoder._geocode(e.target.value);
        geocoder._clear(e);
        geocoder.eventManager.start(geocoder);
        setJustSearched(true);
      } else {
        if (justSearched) {
          console.log("Just searched");

          geocoder.clear();
          setJustSearched(false);
        }
      }
    };

    setGeocoder(geocoder);
    map.addControl(geocoder);
  }, []);

  useEffect(() => {
    console.log("HII");
  }, [geocoder]);

  return <div />;
}

function MapboxMap() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: "100%", height: "500px" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <Geocoder />
    </Map>
  );
}

export default MapboxMap;
