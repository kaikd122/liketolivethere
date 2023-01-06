import { createContext, useState } from "react";

const MapContext = createContext<MapContextProps>({
  map: null,
  setMap: () => {},
});

export interface MapContextProps {
  map: any;
  setMap: (map: any) => void;
}

const Provider = MapContext.Provider;

function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState(null);

  return (
    <Provider
      value={{
        map,
        setMap,
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, MapContext };
