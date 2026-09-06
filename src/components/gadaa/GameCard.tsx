import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Play, Sparkles } from "lucide-react";
import wordBuilderArt from "@/assets/games/word-builder.jpg";
import wordSearchArt from "@/assets/games/word-search.jpg";
import jigsawArt from "@/assets/games/jigsaw.jpg";
import pictureMatchArt from "@/assets/games/picture-match.jpg";
import oddOneOutArt from "@/assets/games/odd-one-out.jpg";
import memoryMatchArt from "@/assets/games/memory-match.jpg";
import triviaArt from "@/assets/games/trivia.jpg";
import trueFalseArt from "@/assets/games/true-false.jpg";
import { fill, useI18n } from "@/lib/i18n";
import { formatClock, gameSeconds, gameXp } from "@/lib/game-clock";
import type { QuestGameId } from "@/lib/quest-games";

const gameArt: Record<QuestGameId, string> = {
  words: wordBuilderArt,
  search: wordSearchArt,
  jigsaw: jigsawArt,
  picture: pictureMatchArt,
  odd: oddOneOutArt,
  memory: memoryMatchArt,
  trivia: triviaArt,
  facts: trueFalseArt,
};

const cardFrame: Record<QuestGameId, string> = {
  words: "min-h-[22rem] sm:min-h-[26rem]",
  search: "min-h-[18rem] sm:min-h-[22rem]",
  jigsaw: "min-h-[20rem] sm:min-h-[24rem] lg:col-span-2",
  picture: "min-h-[18rem] sm:min-h-[22rem]",
  odd: "min-h-[20rem] sm:min-h-[24rem]",
  memory: "min-h-[16rem] sm:min-h-[18rem] lg:col-span-2",
  trivia: "min-h-[18rem] sm:min-h-[21rem]",
  facts: "min-h-[20rem] sm:min-h-[24rem]",
};

export function GameCard({
  id,
  title,
  blurb,
}: {
  id: QuestGameId;
  title: string;
  blurb: string;
}) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLAnchorElement>(null);

  function onMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }

  function onLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "40%");
  }

  return (
    <Link
      ref={cardRef}
      to="/quests"
      search={{ game: id }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`game-card group relative flex overflow-hidden rounded-3xl ring-1 ring-border ${cardFrame[id]}`}
    >
      <img
        src={gameArt[id]}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <span className="game-card-shine pointer-events-none absolute inset-0" />

      <span className="relative mt-auto flex w-full flex-col p-5 sm:p-6">
        <span className="mb-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            {fill(t.quests.timer.xp, { xp: gameXp[id] })}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md">
            <Clock className="h-3 w-3 text-primary" />
            {formatClock(gameSeconds[id])}
          </span>
        </span>
        <h3 className="font-display text-2xl font-bold leading-tight">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{blurb}</p>
        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-105">
          <Play className="h-4 w-4 fill-current" />
          {t.quests.playGame}
        </span>
      </span>
    </Link>
  );
}
