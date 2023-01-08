import { createContext, useState } from "react";

const mapContext = createContext(undefined);

const Provider = mapContext.Provider;

function MapProvider({ children }) {
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

export { MapProvider, mapContext };
