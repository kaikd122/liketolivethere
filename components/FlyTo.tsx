import { useEffect } from "react";
import { useMap } from "react-map-gl";
import uzeStore from "../lib/store/store";

export default function FlyTo() {
  const { current: map } = useMap();
  const { setIsMapViewUnsearched, setZoom, setBounds } = uzeStore(
    (state) => state.actions
  );
  const isMapViewUnsearched = uzeStore((state) => state.isMapViewUnsearched);
  const coordinates = uzeStore((state) => state.coordinates);
  const zoom = uzeStore((state) => state.zoom);
  const isCreatingReview = uzeStore((state) => state.isCreatingReview);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (isMapViewUnsearched === false) {
      setIsMapViewUnsearched(true);
    }
    setBounds(map.getBounds().toArray().flat());
    setZoom(map.getZoom());
    if (isCreatingReview) {
      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: zoom,
      });
    }
  }, [coordinates, zoom]);
  return null;
}
