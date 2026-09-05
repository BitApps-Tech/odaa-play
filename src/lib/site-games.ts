import {
  mapSites,
  mapSiteTypes,
  type MapSite,
  type MapSiteType,
} from "@/lib/oromia-map";

export function siteArea(site: MapSite): string {
  const zone = site.zone.replace(/\s+/g, " ").trim();
  if (zone.length > 1 && zone.length < 28 && !/Opening|of the|Regional State/i.test(zone)) {
    return zone;
  }
  const woreda = site.woreda.replace(/\s+/g, " ").trim();
  if (woreda.length > 1 && woreda.length < 36 && !/Opening|Information/i.test(woreda)) {
    return woreda;
  }
  return "";
}

export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const next = [...items];
  let h = hashSeed(seed);
  for (let i = next.length - 1; i > 0; i--) {
    h = Math.imul(h, 1664525) + 1013904223;
    const j = (h >>> 0) % (i + 1);
    const left = next[i] as T;
    const right = next[j] as T;
    next[i] = right;
    next[j] = left;
  }
  return next;
}

export function namePuzzle(site: MapSite): { answer: string; tiles: string[] } {
  const cleaned = site.name.replace(/[^a-zA-Z\s]/g, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ").filter(Boolean).slice(0, 2);
  const answer = (words.join(" ") || site.name).toUpperCase();
  const letters = answer.replace(/\s+/g, "").split("");
  return { answer, tiles: seededShuffle(letters, `${site.id}-letters`) };
}

export function otherTypes(type: MapSiteType, count: number, seed: string): MapSiteType[] {
  const pool = mapSiteTypes.filter((id) => id !== type);
  return seededShuffle(pool, seed).slice(0, count);
}

export function typeChoices(site: MapSite): MapSiteType[] {
  return seededShuffle([site.type, ...otherTypes(site.type, 2, `${site.id}-type`)], `${site.id}-type-opt`);
}

export function pictureChoices(site: MapSite): MapSiteType[] {
  return seededShuffle([site.type, ...otherTypes(site.type, 3, `${site.id}-pic`)], `${site.id}-pic-opt`);
}

export function zoneChoices(site: MapSite): string[] {
  const correct = siteArea(site);
  if (!correct) return [];
  const decoys = new Set<string>();
  for (const other of seededShuffle(mapSites, `${site.id}-zone`)) {
    const area = siteArea(other);
    if (area && area !== correct) decoys.add(area);
    if (decoys.size >= 2) break;
  }
  return seededShuffle([correct, ...decoys], `${site.id}-zone-opt`);
}

export function memoryTypes(site: MapSite): MapSiteType[] {
  return [site.type, ...otherTypes(site.type, 3, `${site.id}-mem`)];
}

export const QUEST_PICTURE_TYPES: MapSiteType[] = ["cave", "lake", "gada", "mountain"];

export const QUEST_MEMORY_TYPES: MapSiteType[] = ["cave", "lake", "gada", "heritage"];

export const QUEST_ODD_ONE: { match: MapSiteType; odd: MapSiteType } = {
  match: "lake",
  odd: "mountain",
};
