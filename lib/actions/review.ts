//make method for creating review

import { Coordinates } from "../../types/types";

export interface createReviewArgs {
  data: {
    body: string;
    title: string;
    userId: string;
    latitude: number;
    longitude: number;
    rating: number;
    id?: string;
  };
}

export interface updateReviewArgs {
  data: {
    body: string;
    title: string;
    userId: string;
    latitude: number;
    longitude: number;
    rating: number;
    id: string;
  };
}

export interface getReviewsNearTownArgs {
  data: {
    townId: number;
    offset?: number;
    limit?: number;
    distanceInMetres?: number;
  };
}

export interface getReviewByIdArgs {
  data: {
    id: string;
  };
}

export interface getReviewsWithinMapBoundsArgs {
  data: {
    bounds: {
      ne: Coordinates;
      sw: Coordinates;
    };
    coordinates: Coordinates;
    offset?: number;
    limit?: number;
  };
}

export async function createReviewCommand(args: createReviewArgs) {
  const res = await fetch("/api/createReview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

export async function updateReviewCommand(args: updateReviewArgs) {
  const res = await fetch("/api/updateReview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

//

export async function getReviewsNearTownRequest(args: getReviewsNearTownArgs) {
  const res = await fetch("/api/getReviewsNearTown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

export async function getReviewsWithinMapBoundsRequest(
  args: getReviewsWithinMapBoundsArgs
) {
  const res = await fetch("/api/getReviewsWithinMapBounds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

export async function getReviewByIdRequest(args: getReviewByIdArgs) {
  const res = await fetch("/api/getReviewById", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

export async function getRandomReviewRequest() {
  const res = await fetch("/api/getRandomReview", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res;
}

export async function deleteReviewCommand(args: { id: string }) {
  const res = await fetch("/api/deleteReview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

export async function getReviewsForUserRequest(args: { userId: string }) {
  const res = await fetch("/api/getReviewsForUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}
