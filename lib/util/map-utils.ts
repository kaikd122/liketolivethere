import { Coordinates } from "../../types/types";

export function coordsArrayToObject(coordsArray: Array<number>): Coordinates {
  return { lat: coordsArray[1], lng: coordsArray[0] };
}

export function getPostcodeOutcode(
  postcode: string | null | undefined
): string {
  if (!postcode) {
    return "";
  }
  return postcode.split(" ")[0];
}
