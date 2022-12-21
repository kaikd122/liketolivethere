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
