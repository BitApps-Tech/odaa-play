import { useEffect, useState, type ReactNode } from "react";
import { Clock, PartyPopper, RotateCcw, Sparkles, TimerOff } from "lucide-react";
import { fill, useI18n } from "@/lib/i18n";
import { formatClock, gameSeconds, gameXp } from "@/lib/game-clock";
import type { QuestGameId } from "@/lib/quest-games";

export function GameRound({
  id,
  won,
  xp,
  onReset,
  children,
}: {
  id: QuestGameId;
  won: boolean;
  xp?: number;
  onReset: () => void;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const g = t.quests.timer;
  const seconds = gameSeconds[id];
  const prize = xp ?? gameXp[id];
  const [run, setRun] = useState(0);
  const [left, setLeft] = useState(seconds);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    setLeft(seconds);
    setLost(false);
  }, [seconds, run]);

  useEffect(() => {
    if (won || lost) return;
    const timer = window.setInterval(() => {
      setLeft((n) => {
        if (n <= 1) {
          setLost(true);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [won, lost, run]);

  const status = lost ? "lost" : won ? "won" : "play";
  const urgent = left <= 10 && status === "play";

  function retry() {
    onReset();
    setRun((n) => n + 1);
  }

  return (
    <div className="relative">
      <div
        className={`mb-4 flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold ${
          urgent
            ? "animate-pulse bg-primary/15 text-primary"
            : status === "won"
              ? "bg-gold/15 text-gold"
              : status === "lost"
                ? "bg-secondary text-muted-foreground"
                : "bg-secondary/70"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {g.label}
        </span>
        <span className="font-display text-lg tabular-nums">{formatClock(left)}</span>
      </div>

      <div className={status === "play" ? "" : "pointer-events-none select-none opacity-40"}>
        {children}
      </div>

      {status !== "play" && (
        <div className="animate-rise fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          {status === "won" ? (
            <div className="glass-strong relative w-full max-w-sm overflow-hidden rounded-3xl p-8 text-center shadow-glow">
              <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "var(--gradient-gold)" }} />
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-gold ring-2 ring-gold/50">
                <PartyPopper className="h-8 w-8" />
              </span>
              <h3 className="relative mt-4 font-display text-3xl font-bold text-gold">{g.congrats}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{g.congratsBody}</p>
              <p className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-4 py-2 text-sm font-bold text-gold">
                <Sparkles className="h-4 w-4" />
                {fill(g.xp, { xp: prize })}
              </p>
              <button
                type="button"
                onClick={retry}
                className="relative mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> {g.tryAgain}
              </button>
            </div>
          ) : (
            <div className="glass-strong w-full max-w-sm rounded-3xl p-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/40">
                <TimerOff className="h-8 w-8" />
              </span>
              <h3 className="mt-4 font-display text-3xl font-bold">{g.gameOver}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{g.gameOverBody}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <RotateCcw className="h-4 w-4" /> {g.tryAgain}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
