import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L, { Icon, Control } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

declare module "leaflet" {
  interface Control {
    Watermark: {
      onAdd: () => HTMLImageElement;
      onRemove: () => void;
    };
  }
}

const icon = new Icon({
  iconUrl: "/violet-pin.png",
  iconSize: [25, 33],
  iconAnchor: [12.5, 41],
});

export interface MapChildProps {
  isAdded: boolean;
  setIsAdded: Dispatch<SetStateAction<boolean>>;
}

function SearchBar({ isAdded, setIsAdded }: MapChildProps) {
  if (isAdded) {
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
    setIsAdded(true);
  }, []);

  return null;
}

function Watermark({ isAdded, setIsAdded }: MapChildProps) {
  if (isAdded) {
    return null;
  }
  const map = useMap();
  L.Control.Watermark = L.Control.extend({
    onAdd: function () {
      var img = L.DomUtil.create("img");
      img.src = "/mapbox-logo-black.png";
      img.style.width = "100px";
      return img;
    },
    onRemove: function () {
      // Nothing to do here
    },
  });

  L.control.watermark = function (opts) {
    return new L.Control.Watermark(opts);
  };

  useEffect(() => {
    const watermark = L.control.watermark({ position: "bottomleft" });
    map.addControl(watermark);
    setIsAdded(true);
  }, []);

  return null;
}

function Map() {
  const [isSearchBarAdded, setIsSearchBarAdded] = useState(false);
  const [isWatermarkAdded, setIsWatermarkAdded] = useState(false);
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
          isAdded={isSearchBarAdded}
          setIsAdded={setIsSearchBarAdded}
        />
        <Watermark
          isAdded={isWatermarkAdded}
          setIsAdded={setIsWatermarkAdded}
        />
        <TileLayer
          attribution={`&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>`}
          url="https://api.mapbox.com/styles/v1/liketolivethere/clayk9uf300jl14o3vdt15ijl/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGlrZXRvbGl2ZXRoZXJlIiwiYSI6ImNsYXlraGJ3NjBjNWQzc281Nm0wdjUwYzYifQ.Bf_rCJ63GmspoX170JUFYQ"
          zoomOffset={-1}
          tileSize={512}
        />
        <Marker position={[51.505, -0.09]} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default Map;
