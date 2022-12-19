//make method for creating review

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

export interface getReviewsNearTownArgs {
  data: {
    townId: number;
  };
}

export interface getReviewByIdArgs {
  data: {
    id: string;
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
//

export async function getReviewsNearTownRequest(args: getReviewsNearTownArgs) {
  const res = await fetch("/api/getReviewsNearTown", {
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
