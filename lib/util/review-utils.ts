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
