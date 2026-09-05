import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { SiteScene } from "./SiteScene";
import { seededShuffle } from "@/lib/site-games";
import type { MapSiteType } from "@/lib/oromia-map";

type Card = { key: string; type: MapSiteType };

export function MemoryMatch({
  types,
  seed,
  labels,
  prompt,
  wonLabel,
  xp,
}: {
  types: MapSiteType[];
  seed: string;
  labels: Record<string, string>;
  prompt: string;
  wonLabel: string;
  xp: number;
}) {
  const deck = useMemo<Card[]>(() => {
    const pairs = types.flatMap((type) => [
      { key: `${type}-a`, type },
      { key: `${type}-b`, type },
    ]);
    return seededShuffle(pairs, seed);
  }, [seed, types]);

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    setOpen([]);
    setMatched([]);
    setLock(false);
  }, [seed]);

  const won = matched.length === deck.length;

  function flip(card: Card) {
    if (lock || won || open.includes(card.key) || matched.includes(card.key)) return;
    const next = [...open, card.key];
    setOpen(next);
    if (next.length < 2) return;

    const [firstKey, secondKey] = next;
    const first = deck.find((c) => c.key === firstKey);
    const second = deck.find((c) => c.key === secondKey);
    if (first && second && first.type === second.type) {
      setMatched((m) => [...m, first.key, second.key]);
      setOpen([]);
      return;
    }
    setLock(true);
    window.setTimeout(() => {
      setOpen([]);
      setLock(false);
    }, 700);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {deck.map((card) => {
          const faceUp = open.includes(card.key) || matched.includes(card.key);
          return (
            <button
              key={card.key}
              onClick={() => flip(card)}
              aria-label={faceUp ? (labels[card.type] ?? card.type) : "card"}
              className={`aspect-square overflow-hidden rounded-xl ring-1 transition-transform ${
                matched.includes(card.key) ? "ring-gold/70" : "ring-border"
              } ${faceUp ? "" : "bg-primary/90"}`}
            >
              {faceUp ? (
                <SiteScene type={card.type} title={labels[card.type] ?? card.type} className="h-full w-full" />
              ) : (
                <span className="grid h-full place-items-center font-display text-lg font-bold text-primary-foreground">
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
      {won && (
        <p className="animate-rise mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          {wonLabel.replace("{xp}", String(xp))}
        </p>
      )}
    </div>
  );
}
