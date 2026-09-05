import type { QuestGameId } from "@/lib/quest-games";

/** Seconds allowed for each quest game, scaled by how long a round takes. */
export const gameSeconds: Record<QuestGameId, number> = {
  odd: 25,
  picture: 50,
  facts: 55,
  memory: 70,
  words: 80,
  trivia: 100,
  jigsaw: 100,
  search: 140,
};

export const gameXp: Record<QuestGameId, number> = {
  odd: 20,
  picture: 120,
  facts: 80,
  memory: 50,
  words: 120,
  trivia: 90,
  jigsaw: 60,
  search: 50,
};

export function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m <= 0) return `${s}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
