import { Coordinates } from "../../types/types";

export function coordsArrayToObject(coordsArray: Array<number>): Coordinates {
  return { lat: coordsArray[1], lng: coordsArray[0] };
}
