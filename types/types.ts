import { Decimal } from "@prisma/client/runtime";

export interface Coordinates {
  lat: number;
  lng: number;
}

export const kingsCrossCoords: Coordinates = {
  lat: 51.531723,
  lng: -0.1267944,
};

export interface Point {
  coordinates: Coordinates;
}

export interface ReviewFeature {
  type: string;
  properties: {
    id: string | undefined;
    title: string | undefined;
    rating: number | null | undefined;
  };
  geometry: {
    type: string;
    coordinates: (Decimal | undefined)[];
  };
}
