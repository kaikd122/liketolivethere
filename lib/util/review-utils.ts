import { Review } from "@prisma/client";
import { ReviewWithDistance } from "../../components/TownReviewsList";
import { ReviewFeature } from "../../types/types";

export function ratingEnumToString(rating: number): string {
  switch (rating) {
    case 1:
      return "Negative";
    case 2:
      return "Neutral";
    case 3:
      return "Positive";
    default:
      return "Unknown";
  }
}

export function reviewFeaturesToDetails(features: ReviewFeature[]): {
  count: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
} {
  let count = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  features.forEach((feature) => {
    count++;
    if (feature.properties.rating === 1) {
      negativeCount++;
    } else if (feature.properties.rating === 2) {
      neutralCount++;
    } else if (feature.properties.rating === 3) {
      positiveCount++;
    }
  });
  return {
    count,
    positiveCount,
    negativeCount,
    neutralCount,
  };
}

export function reviewsToFeatures(data: Partial<Review>[]): ReviewFeature[] {
  return data.map((r) => ({
    type: "Feature",
    properties: {
      id: r.id,
      title: r.title,
      rating: r.rating,
    },
    geometry: {
      type: "Point",
      coordinates: [r.longitude, r.latitude],
    },
  }));
}

export function metresToKm(metres: number): number {
  return (metres / 1000).toFixed(1) as unknown as number;
}
