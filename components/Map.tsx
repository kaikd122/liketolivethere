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
  iconUrl: "/violet-pin.png",
  iconSize: [25, 33],
  iconAnchor: [12.5, 41],
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
      searchLabel: 'e.g. "London", "SE1", "Big Ben"',
      position: "topleft",
      marker: {
        icon,
      },
    });
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
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full flex flex-row p-1"
        zoomControl={false}
      >
        <SearchBar
          isSearchBarAdded={isSearchBarAdded}
          setIsSearchBarAdded={setIsSearchBarAdded}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/liketolivethere/clayk9uf300jl14o3vdt15ijl/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGlrZXRvbGl2ZXRoZXJlIiwiYSI6ImNsYXlraGJ3NjBjNWQzc281Nm0wdjUwYzYifQ.Bf_rCJ63GmspoX170JUFYQ"
          zoomOffset={-1}
          tileSize={512}
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
