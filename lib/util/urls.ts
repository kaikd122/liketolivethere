import { towns } from "@prisma/client";

export function getTownSlug(town: Partial<towns>): string {
  return town.name?.replace(/\W/g, "") || "";
}
export function getTownUrl(town: Partial<towns>): string {
  return `/towns/${getTownSlug(town)}`;
}

export function replaceUrl(url: string) {
  window.history.replaceState(
    {
      ...window.history.state,
      as: url,
      url: url,
    },
    "",
    url
  );
}
