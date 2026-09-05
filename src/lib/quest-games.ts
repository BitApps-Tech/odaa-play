export const questGameIds = ["words", "jigsaw", "picture", "odd", "memory", "trivia"] as const;

export type QuestGameId = (typeof questGameIds)[number];

export const questCategories = [
  { id: "language", games: ["words"] },
  { id: "pictures", games: ["jigsaw", "picture", "odd", "memory"] },
  { id: "trivia", games: ["trivia"] },
] as const;

export type QuestCategoryId = (typeof questCategories)[number]["id"];

export function parseQuestGame(value: unknown): QuestGameId | undefined {
  return typeof value === "string" && (questGameIds as readonly string[]).includes(value)
    ? (value as QuestGameId)
    : undefined;
}
