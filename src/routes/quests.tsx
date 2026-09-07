import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ImageIcon,
  Languages,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Page } from "@/components/gadaa/Page";
import { PictorialGames } from "@/components/gadaa/PictorialGames";
import { FactCheck } from "@/components/gadaa/FactCheck";
import { GameCard } from "@/components/gadaa/GameCard";
import { GamesBanner } from "@/components/gadaa/GamesBanner";
import { GameRound } from "@/components/gadaa/GameRound";
import { WordSearch } from "@/components/gadaa/WordSearch";
import { puzzles, trivia } from "@/lib/gadaa-data";
import { useI18n } from "@/lib/i18n";
import {
  parseQuestGame,
  questCategories,
  type QuestCategoryId,
  type QuestGameId,
} from "@/lib/quest-games";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [{ title: "Games — Odaa Play" }],
  }),
  validateSearch: (search: Record<string, unknown>): { game?: QuestGameId } => {
    const game = parseQuestGame(search["game"]);
    return game ? { game } : {};
  },
  component: Quests,
});

const categoryIcons: Record<QuestCategoryId, typeof Languages> = {
  language: Languages,
  pictures: ImageIcon,
  trivia: BookOpen,
};

function gameTitle(t: ReturnType<typeof useI18n>["t"], id: QuestGameId) {
  if (id === "words") return t.quests.wordBuilder;
  if (id === "search") return t.quests.wordSearchTitle;
  if (id === "jigsaw") return t.quests.pictorial.jigsawTitle;
  if (id === "picture") return t.quests.pictorial.pictureQuiz;
  if (id === "odd") return t.quests.pictorial.oddTitle;
  if (id === "memory") return t.quests.pictorial.memoryTitle;
  if (id === "facts") return t.quests.factCheckTitle;
  return t.quests.trivia;
}

function WordBuilder({
  p,
  prompt,
  tapTiles,
  solvedLabel,
  resetLabel,
  onSolved,
}: {
  p: (typeof puzzles)[number];
  prompt: string;
  tapTiles: string;
  solvedLabel: string;
  resetLabel: string;
  onSolved: (solved: boolean) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const built = picked.join(p.scrambled.some((s) => s.length > 4) ? " " : "");
  const solved = built.replace(/\s+/g, "") === p.answer.replace(/\s+/g, "");
  const pool = p.scrambled.filter((s) => !picked.includes(s));

  useEffect(() => {
    onSolved(solved);
  }, [solved, onSolved]);

  return (
    <div className="glass hover-lift rounded-2xl p-5">
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <div
        className={`mt-4 min-h-12 rounded-xl border border-dashed px-4 py-3 font-display text-lg font-bold tracking-wide ${
          solved ? "border-gold/60 text-gold" : "border-border"
        }`}
      >
        {built || <span className="text-sm text-muted-foreground">{tapTiles}</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((s) => (
          <button
            key={s}
            onClick={() => setPicked((v) => [...v, s])}
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gold">
          <Sparkles className="h-3.5 w-3.5" /> +{p.xp} XP
        </span>
        {solved ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gold">
            <Check className="h-4 w-4" /> {solvedLabel}
          </span>
        ) : (
          <button
            onClick={() => setPicked([])}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function WordGames() {
  const { t } = useI18n();
  const [tick, setTick] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const won = puzzles.every((p) => done[p.id]);
  const xp = puzzles.reduce((sum, p) => sum + p.xp, 0);

  return (
    <GameRound
      id="words"
      won={won}
      xp={xp}
      onReset={() => {
        setDone({});
        setTick((n) => n + 1);
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {puzzles.map((p) => (
          <WordBuilder
            key={`${p.id}-${tick}`}
            p={p}
            prompt={t.quests.puzzles[p.id] ?? p.id}
            tapTiles={t.quests.tapTiles}
            solvedLabel={t.quests.solved}
            resetLabel={t.quests.reset}
            onSolved={(solved) =>
              setDone((current) => (current[p.id] === solved ? current : { ...current, [p.id]: solved }))
            }
          />
        ))}
      </div>
    </GameRound>
  );
}

function Trivia() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const categories = [...new Set(t.quests.triviaItems.map((item) => item.category))];
  const won = t.quests.triviaItems.every((_, i) => answers[i] !== undefined);
  const xp = t.quests.triviaItems.reduce((sum, _, i) => sum + (answers[i] === trivia[i]?.answer ? 10 : 0), 0);

  return (
    <GameRound id="trivia" won={won} xp={xp} onReset={() => setAnswers({})}>
    <div className="space-y-8">
      {categories.map((category) => {
        const items = t.quests.triviaItems
          .map((item, i) => ({ item, i }))
          .filter(({ item }) => item.category === category);
        return (
          <div key={category}>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-gold uppercase">
              {category}
            </h3>
            <div className="grid gap-5 lg:grid-cols-3">
              {items.map(({ item, i }) => {
                const chosen = answers[i];
                const answer = trivia[i]?.answer;
                return (
                  <div key={item.question} className="glass rounded-2xl p-5">
                    <p className="font-display text-sm font-bold">{item.question}</p>
                    <div className="mt-4 grid gap-2">
                      {item.options.map((o, oi) => {
                        const state =
                          chosen === undefined
                            ? "idle"
                            : oi === answer
                              ? "right"
                              : oi === chosen
                                ? "wrong"
                                : "idle";
                        return (
                          <button
                            key={o}
                            onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                            className={`rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                              state === "right"
                                ? "bg-gold/20 text-gold ring-1 ring-gold/60"
                                : state === "wrong"
                                  ? "bg-primary/20 text-foreground ring-1 ring-primary/60"
                                  : "bg-secondary hover:bg-accent"
                            }`}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
    </GameRound>
  );
}

function GamePicker() {
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">{t.quests.chooseGame}</h2>
      {questCategories.map((category) => {
        const CategoryIcon = categoryIcons[category.id];
        return (
          <section key={category.id}>
            <div className="mb-4 flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40">
                <CategoryIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold">{t.quests.categories[category.id]}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.id === "language"
                    ? t.quests.categories.languageBlurb
                    : category.id === "pictures"
                      ? t.quests.categories.picturesBlurb
                      : t.quests.categories.triviaBlurb}
                </p>
              </div>
            </div>
            <div
              className={
                category.id === "pictures"
                  ? "grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                  : "grid gap-4 md:grid-cols-2"
              }
            >
              {category.games.map((id) => (
                <GameCard key={id} id={id} title={gameTitle(t, id)} blurb={t.quests.gameBlurbs[id]} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Quests() {
  const { t } = useI18n();
  const { game } = Route.useSearch();

  return (
    <Page
      eyebrow={t.quests.eyebrow}
      title={t.quests.title}
      intro={t.quests.intro}
      source={t.quests.source}
      hero={<GamesBanner />}
    >
      {game ? (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/quests"
              search={{}}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {t.quests.backToGames}
            </Link>
            <h2 className="text-lg font-bold">{gameTitle(t, game)}</h2>
          </div>
          <div className="mt-5">
            {game === "words" ? (
              <WordGames />
            ) : game === "search" ? (
              <WordSearch />
            ) : game === "trivia" ? (
              <Trivia />
            ) : game === "facts" ? (
              <FactCheck />
            ) : (
              <PictorialGames kind={game} />
            )}
          </div>
        </section>
      ) : (
        <GamePicker />
      )}
    </Page>
  );
}
