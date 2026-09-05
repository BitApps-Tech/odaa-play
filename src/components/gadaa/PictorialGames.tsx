import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { JigsawPuzzle } from "./JigsawPuzzle";
import { MemoryMatch } from "./MemoryMatch";
import { PicturePick } from "./PicturePick";
import { SiteScene } from "./SiteScene";
import { fill, useI18n } from "@/lib/i18n";
import type { MapSiteType } from "@/lib/oromia-map";
import {
  QUEST_MEMORY_TYPES,
  QUEST_ODD_ONE,
  QUEST_PICTURE_TYPES,
  otherTypes,
  seededShuffle,
} from "@/lib/site-games";

export type PictorialKind = "jigsaw" | "picture" | "odd" | "memory";

export function PictorialGames({ kind }: { kind: PictorialKind }) {
  const { t } = useI18n();
  const g = t.quests.pictorial;
  const [pictureAnswers, setPictureAnswers] = useState<Record<string, MapSiteType>>({});
  const [oddChoice, setOddChoice] = useState<number | null>(null);

  const pictureRounds = useMemo(
    () =>
      QUEST_PICTURE_TYPES.map((type) => ({
        type,
        options: seededShuffle([type, ...otherTypes(type, 3, `quest-pic-${type}`)], `quest-opt-${type}`),
      })),
    [],
  );

  const oddCards = useMemo(
    () =>
      seededShuffle(
        [QUEST_ODD_ONE.match, QUEST_ODD_ONE.match, QUEST_ODD_ONE.match, QUEST_ODD_ONE.odd],
        "quest-odd",
      ),
    [],
  );
  const oddIndex = oddCards.lastIndexOf(QUEST_ODD_ONE.odd);

  if (kind === "jigsaw") return <JigsawPuzzle />;

  if (kind === "picture") {
    return (
      <section>
        <h3 className="text-lg font-bold">{g.pictureQuiz}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{g.pictureIntro}</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {pictureRounds.map((round) => (
            <div key={round.type} className="glass rounded-2xl p-5">
              <PicturePick
                question={fill(g.pictureQuestion, { type: t.map.types[round.type] ?? round.type })}
                options={round.options}
                answer={round.type}
                labels={t.map.types}
                choice={pictureAnswers[round.type] ?? null}
                onChoose={(next) => setPictureAnswers((prev) => ({ ...prev, [round.type]: next }))}
                xp={30}
                correctLabel={t.map.correct}
                wrongLabel={t.map.wrong}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (kind === "odd") {
    return (
      <section className="glass rounded-2xl p-5">
        <h3 className="text-lg font-bold">{g.oddTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{g.oddPrompt}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {oddCards.map((type, i) => {
            const state =
              oddChoice === null ? "idle" : i === oddIndex ? "right" : i === oddChoice ? "wrong" : "idle";
            return (
              <button
                key={`${type}-${i}`}
                onClick={() => setOddChoice(i)}
                className={`overflow-hidden rounded-2xl ring-1 ${
                  state === "right"
                    ? "ring-gold/70"
                    : state === "wrong"
                      ? "ring-primary/70"
                      : "ring-border hover:ring-primary/40"
                }`}
              >
                <SiteScene type={type} title={t.map.types[type] ?? type} className="aspect-[8/5] w-full" />
              </button>
            );
          })}
        </div>
        {oddChoice !== null && (
          <p className="animate-rise mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            {oddChoice === oddIndex ? fill(t.map.correct, { xp: 20 }) : t.map.wrong}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="text-lg font-bold">{g.memoryTitle}</h3>
      <MemoryMatch
        types={QUEST_MEMORY_TYPES}
        seed="quests-memory"
        labels={t.map.types}
        prompt={g.memoryPrompt}
        wonLabel={g.memoryWon}
        xp={50}
      />
    </section>
  );
}
