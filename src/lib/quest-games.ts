export const questGameIds = ["words", "search", "jigsaw", "picture", "odd", "memory", "trivia", "facts"] as const;

export type QuestGameId = (typeof questGameIds)[number];

export const questCategories = [
  { id: "language", games: ["words", "search"] },
  { id: "pictures", games: ["jigsaw", "picture", "odd", "memory"] },
  { id: "trivia", games: ["trivia", "facts"] },
] as const;

export type QuestCategoryId = (typeof questCategories)[number]["id"];

export function parseQuestGame(value: unknown): QuestGameId | undefined {
  return typeof value === "string" && (questGameIds as readonly string[]).includes(value)
    ? (value as QuestGameId)
    : undefined;
}
