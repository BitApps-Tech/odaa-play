import { useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";

export function WordPuzzle({
  tiles,
  answer,
  prompt,
  tapTiles,
  solvedLabel,
  resetLabel,
  xp,
}: {
  tiles: string[];
  answer: string;
  prompt: string;
  tapTiles: string;
  solvedLabel: string;
  resetLabel: string;
  xp: number;
}) {
  const [picked, setPicked] = useState<number[]>([]);
  const built = picked.map((i) => tiles[i]).join("");
  const target = answer.replace(/\s+/g, "");
  const solved = built === target;
  const available = tiles.map((tile, i) => ({ tile, i })).filter(({ i }) => !picked.includes(i));

  return (
    <div className="rounded-2xl bg-secondary/60 p-4">
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <div
        className={`mt-4 min-h-12 rounded-xl border border-dashed px-4 py-3 font-display text-lg font-bold tracking-[0.18em] ${
          solved ? "border-gold/60 text-gold" : "border-border"
        }`}
      >
        {built || <span className="text-sm tracking-normal text-muted-foreground">{tapTiles}</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {available.map(({ tile, i }) => (
          <button
            key={`${tile}-${i}`}
            onClick={() => setPicked((v) => [...v, i])}
            className="min-w-10 rounded-lg bg-background/70 px-3 py-2 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {tile}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gold">
          <Sparkles className="h-3.5 w-3.5" /> +{xp} XP
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
