import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { Icon } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

const icon = new Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface SearchBarProps {
  isSearchBarAdded: boolean;
  setIsSearchBarAdded: Dispatch<SetStateAction<boolean>>;
}

function SearchBar({ isSearchBarAdded, setIsSearchBarAdded }: SearchBarProps) {
  console.log(isSearchBarAdded, "hi");
  if (isSearchBarAdded) {
    return null;
  }
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = GeoSearchControl({
      provider,
      position: "topleft",
      marker: {
        icon,
      },
    });

    console.log("ADDING");
    map.addControl(searchControl);
    setIsSearchBarAdded(true);
  }, []);

  return null;
}

function Map() {
  const [isSearchBarAdded, setIsSearchBarAdded] = useState(false);
  return (
    <div className="h-[600px] w-full p-10">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full flex flex-row"
        zoomControl={false}
      >
        <SearchBar
          isSearchBarAdded={isSearchBarAdded}
          setIsSearchBarAdded={setIsSearchBarAdded}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/liketolivethere/clayk9uf300jl14o3vdt15ijl/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGlrZXRvbGl2ZXRoZXJlIiwiYSI6ImNsYXlraGJ3NjBjNWQzc281Nm0wdjUwYzYifQ.Bf_rCJ63GmspoX170JUFYQ"
        />
        <Marker position={[51.505, -0.09]} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <ZoomControl position="bottomleft" />
      </MapContainer>
    </div>
  );
}

export default Map;
