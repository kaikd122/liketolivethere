export interface getNearbyTownsArgs {
  data: {
    latitude: number;
    longitude: number;
    limit: number;
  };
}

export async function getNearbyTownsRequest(args: getNearbyTownsArgs) {
  const res = await fetch("/api/getNearbyTowns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}
