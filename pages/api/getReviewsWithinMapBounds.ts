import { NextApiRequest, NextApiResponse } from "next";
import { getReviewsWithinMapBoundsArgs } from "../../lib/actions/review";

export interface getReviewsWithinMapBoundsResponse {
  id: number;
  title: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
}
