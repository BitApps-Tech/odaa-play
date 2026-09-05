import { useState } from "react";
import { Sparkles } from "lucide-react";
import { MemoryMatch } from "./MemoryMatch";
import { PicturePick } from "./PicturePick";
import { WordPuzzle } from "./WordPuzzle";
import { destinations } from "@/lib/gadaa-data";
import { fill, useI18n } from "@/lib/i18n";
import { quizSiteId, type MapSite, type MapSiteType } from "@/lib/oromia-map";
import {
  memoryTypes,
  namePuzzle,
  pictureChoices,
  siteArea,
  typeChoices,
  zoneChoices,
} from "@/lib/site-games";

const tabs = ["quiz", "puzzle", "pictures", "memory"] as const;
type Tab = (typeof tabs)[number];

export function SiteGames({ site }: { site: MapSite }) {
  const { t } = useI18n();
  const g = t.map.games;
  const [tab, setTab] = useState<Tab>("quiz");
  const [typeChoice, setTypeChoice] = useState<number | null>(null);
  const [zoneChoice, setZoneChoice] = useState<number | null>(null);
  const [featuredChoice, setFeaturedChoice] = useState<number | null>(null);
  const [pictureChoice, setPictureChoice] = useState<MapSiteType | null>(null);

  const types = typeChoices(site);
  const zones = zoneChoices(site);
  const pictures = pictureChoices(site);
  const puzzle = namePuzzle(site);
  const area = siteArea(site);
  const featuredId = quizSiteId(site.name);
  const featuredCopy = featuredId ? t.map.places[featuredId] : undefined;
  const featuredDest = featuredId ? destinations.find((d) => d.id === featuredId) : undefined;

  function optionClass(state: "idle" | "right" | "wrong") {
    if (state === "right") return "bg-gold/20 text-gold ring-1 ring-gold/60";
    if (state === "wrong") return "bg-primary/20 ring-1 ring-primary/60";
    return "bg-background/60 hover:bg-accent";
  }

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">{g.title}</p>
      <h3 className="mt-1 text-lg font-bold">{fill(g.forSite, { name: site.name })}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{g.intro}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tabs.map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              tab === id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"
            }`}
          >
            {g.tabs[id]}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-5">
        {tab === "quiz" && (
          <>
            {featuredCopy && featuredDest && (
              <QuizBlock
                question={featuredCopy.quiz}
                options={[...featuredCopy.options]}
                answer={featuredDest.answer}
                choice={featuredChoice}
                onChoose={setFeaturedChoice}
                xp={featuredDest.xp}
                correct={t.map.correct}
                wrong={t.map.wrong}
                optionClass={optionClass}
              />
            )}
            <QuizBlock
              question={fill(g.typeQuestion, { name: site.name })}
              options={types.map((id) => t.map.types[id] ?? id)}
              answer={types.indexOf(site.type)}
              choice={typeChoice}
              onChoose={setTypeChoice}
              xp={25}
              correct={t.map.correct}
              wrong={t.map.wrong}
              optionClass={optionClass}
            />
            {area && zones.length > 1 && (
              <QuizBlock
                question={fill(g.zoneQuestion, { name: site.name })}
                options={zones}
                answer={zones.indexOf(area)}
                choice={zoneChoice}
                onChoose={setZoneChoice}
                xp={25}
                correct={t.map.correct}
                wrong={t.map.wrong}
                optionClass={optionClass}
              />
            )}
          </>
        )}

        {tab === "puzzle" && (
          <WordPuzzle
            tiles={puzzle.tiles}
            answer={puzzle.answer}
            prompt={fill(g.puzzlePrompt, { name: site.name })}
            tapTiles={g.tapTiles}
            solvedLabel={g.solved}
            resetLabel={g.reset}
            xp={35}
          />
        )}

        {tab === "pictures" && (
          <PicturePick
            question={fill(g.pictureQuestion, { name: site.name })}
            options={pictures}
            answer={site.type}
            labels={t.map.types}
            choice={pictureChoice}
            onChoose={setPictureChoice}
            xp={30}
            correctLabel={t.map.correct}
            wrongLabel={t.map.wrong}
          />
        )}

        {tab === "memory" && (
          <MemoryMatch
            types={memoryTypes(site)}
            seed={`${site.id}-memory`}
            labels={t.map.types}
            prompt={g.memoryPrompt}
            wonLabel={g.memoryWon}
            xp={40}
          />
        )}
      </div>
    </div>
  );
}

function QuizBlock({
  question,
  options,
  answer,
  choice,
  onChoose,
  xp,
  correct,
  wrong,
  optionClass,
}: {
  question: string;
  options: string[];
  answer: number;
  choice: number | null;
  onChoose: (i: number) => void;
  xp: number;
  correct: string;
  wrong: string;
  optionClass: (state: "idle" | "right" | "wrong") => string;
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-4">
      <p className="text-sm font-semibold">{question}</p>
      <div className="mt-3 grid gap-2">
        {options.map((option, i) => {
          const state =
            choice === null ? "idle" : i === answer ? "right" : i === choice ? "wrong" : "idle";
          return (
            <button
              key={`${option}-${i}`}
              onClick={() => onChoose(i)}
              className={`rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${optionClass(state)}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <p className="animate-rise mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          {choice === answer ? fill(correct, { xp }) : wrong}
        </p>
      )}
    </div>
  );
}
