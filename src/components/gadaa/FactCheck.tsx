import { useState } from "react";
import { Check, X } from "lucide-react";
import { GameRound } from "./GameRound";
import { FACT_CHECK_XP, factChecks } from "@/lib/gadaa-data";
import { fill, useI18n } from "@/lib/i18n";

export function FactCheck() {
  const { t } = useI18n();
  const g = t.quests.factCheck;
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [right, setRight] = useState(0);
  const item = factChecks[index];
  const done = index >= factChecks.length;
  const statement = item ? (t.quests.factCheckItems[item.id] ?? item.id) : "";
  const correct = item ? choice === item.truth : false;

  function pick(value: boolean) {
    if (!item || choice !== null) return;
    setChoice(value);
    if (value === item.truth) setRight((n) => n + 1);
  }

  function next() {
    setChoice(null);
    setIndex((n) => n + 1);
  }

  function reset() {
    setIndex(0);
    setChoice(null);
    setRight(0);
  }

  return (
    <GameRound id="facts" won={done} xp={right * FACT_CHECK_XP} onReset={reset}>
    {item ? (
    <section className="mx-auto max-w-lg">
      <p className="text-sm text-muted-foreground">{g.intro}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {fill(g.progress, { n: index + 1, total: factChecks.length })}
      </p>

      <div className="glass mt-4 rounded-2xl p-6">
        <p className="font-display text-lg font-bold leading-snug">{statement}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => pick(true)}
            disabled={choice !== null}
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              choice === null
                ? "bg-secondary hover:bg-accent"
                : item?.truth
                  ? "bg-gold/20 text-gold ring-1 ring-gold/60"
                  : choice === true
                    ? "bg-primary/20 ring-1 ring-primary/60"
                    : "bg-secondary opacity-60"
            }`}
          >
            {g.trueLabel}
          </button>
          <button
            type="button"
            onClick={() => pick(false)}
            disabled={choice !== null}
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              choice === null
                ? "bg-secondary hover:bg-accent"
                : item && !item.truth
                  ? "bg-gold/20 text-gold ring-1 ring-gold/60"
                  : choice === false
                    ? "bg-primary/20 ring-1 ring-primary/60"
                    : "bg-secondary opacity-60"
            }`}
          >
            {g.falseLabel}
          </button>
        </div>

        {choice !== null && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <p
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                correct ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {correct ? g.trueLabel : t.map.wrong}
            </p>
            <button
              onClick={next}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              {g.next}
            </button>
          </div>
        )}
      </div>
    </section>
    ) : (
      <div className="min-h-48" />
    )}
    </GameRound>
  );
}
