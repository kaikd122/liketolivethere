export interface getNearbyTownsArgs {
  data: {
    latitude: number;
    longitude: number;
    limit: number;
  };
}

export interface getTownsByTextArgs {
  data: {
    text: string;
  };
}

export interface getTownByIdArgs {
  data: {
    id: number;
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

export async function getTownsByTextRequest(args: getTownsByTextArgs) {
  const res = await fetch("/api/getTownsByText", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}

export async function getTownByIdRequest(args: getTownByIdArgs) {
  const res = await fetch("/api/getTownById", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return res;
}
