import { towns } from "@prisma/client";

export function getTownSlug(town: Partial<towns>): string {
  return town.name?.replace(/\W/g, "") || "";
}
export function getTownUrl(town: Partial<towns>): string {
  return `towns/${getTownSlug(town)}-${town.id}`;
}

export function getTownIdFromSlug(slug: string): number | null {
  const id = slug.split("-").pop();
  if (!isNaN(id as unknown as number)) {
    return parseInt(id!);
  }
  return null;
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
