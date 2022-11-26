import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
      >
        <SearchBar
          isSearchBarAdded={isSearchBarAdded}
          setIsSearchBarAdded={setIsSearchBarAdded}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
