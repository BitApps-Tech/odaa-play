import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { GameRound } from "./GameRound";
import { fill, useI18n } from "@/lib/i18n";
import {
  cellsKey,
  lineCells,
  makeWordSearch,
  WORD_SEARCH_SIZE,
  WORD_SEARCH_WORDS,
  WORD_SEARCH_XP,
  type WordCell,
} from "@/lib/word-search";

const COLORS = [
  "rgba(20,184,166,.42)",
  "rgba(234,179,8,.45)",
  "rgba(244,114,182,.42)",
  "rgba(34,197,94,.42)",
  "rgba(59,130,246,.40)",
  "rgba(249,115,22,.42)",
  "rgba(168,85,247,.40)",
  "rgba(14,165,233,.40)",
];

function samePath(a: WordCell[], b: WordCell[]) {
  const forward = cellsKey(a) === cellsKey(b);
  const backward = cellsKey(a) === cellsKey([...b].reverse());
  return forward || backward;
}

export function WordSearch() {
  const { t } = useI18n();
  const g = t.quests.wordSearch;
  const [seed, setSeed] = useState(0);
  const puzzle = useMemo(() => makeWordSearch(`afaan-search-${seed}`), [seed]);
  const [found, setFound] = useState<string[]>([]);
  const [drag, setDrag] = useState<{ start: WordCell; end: WordCell } | null>(null);

  const selecting = drag ? lineCells(drag.start, drag.end) : null;
  const words = WORD_SEARCH_WORDS.filter((word) => puzzle.placed.some((item) => item.word === word));
  const won = found.length === puzzle.placed.length && puzzle.placed.length > 0;

  function cellFromPoint(x: number, y: number): WordCell | null {
    const el = document.elementFromPoint(x, y);
    const node = el?.closest("[data-search-cell]") as HTMLElement | null;
    if (!node) return null;
    const r = Number(node.dataset["r"]);
    const c = Number(node.dataset["c"]);
    if (!Number.isFinite(r) || !Number.isFinite(c)) return null;
    return { r, c };
  }

  function onPointerDown(event: React.PointerEvent, cell: WordCell) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ start: cell, end: cell });
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!drag) return;
    const cell = cellFromPoint(event.clientX, event.clientY);
    if (!cell) return;
    setDrag({ ...drag, end: cell });
  }

  function onPointerUp() {
    if (!drag || !selecting) {
      setDrag(null);
      return;
    }
    const match = puzzle.placed.find(
      (word) => !found.includes(word.word) && samePath(selecting, word.cells),
    );
    if (match) {
      setFound((current) => (current.includes(match.word) ? current : [...current, match.word]));
    }
    setDrag(null);
  }

  function reset() {
    setSeed((n) => n + 1);
    setFound([]);
    setDrag(null);
  }

  return (
    <GameRound id="search" won={won} xp={WORD_SEARCH_XP} onReset={reset}>
    <section className="mx-auto max-w-lg">
      <p className="text-sm text-muted-foreground">{g.intro}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="relative mx-auto aspect-square w-full max-w-[20rem]">
            <svg viewBox={`0 0 ${WORD_SEARCH_SIZE} ${WORD_SEARCH_SIZE}`} className="pointer-events-none absolute inset-0">
              {puzzle.placed.map((word, i) => {
                if (!found.includes(word.word)) return null;
                const start = word.cells[0];
                const end = word.cells[word.cells.length - 1];
                if (!start || !end) return null;
                return (
                  <line
                    key={word.word}
                    x1={start.c + 0.5}
                    y1={start.r + 0.5}
                    x2={end.c + 0.5}
                    y2={end.r + 0.5}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth="0.72"
                    strokeLinecap="round"
                  />
                );
              })}
              {selecting && selecting.length > 0 && (
                <line
                  x1={(selecting[0]?.c ?? 0) + 0.5}
                  y1={(selecting[0]?.r ?? 0) + 0.5}
                  x2={(selecting[selecting.length - 1]?.c ?? 0) + 0.5}
                  y2={(selecting[selecting.length - 1]?.r ?? 0) + 0.5}
                  stroke="rgba(201,162,39,.35)"
                  strokeWidth="0.72"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div
              className="absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${WORD_SEARCH_SIZE}, minmax(0, 1fr))` }}
            >
              {puzzle.letters.flatMap((row, r) =>
                row.map((letter, c) => (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    data-search-cell
                    data-r={r}
                    data-c={c}
                    onPointerDown={(e) => onPointerDown(e, { r, c })}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => setDrag(null)}
                    className="grid aspect-square place-items-center touch-none text-[13px] font-semibold sm:text-sm"
                  >
                    {letter}
                  </button>
                )),
              )}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">{g.list}</p>
          <ul className="mt-3 space-y-1.5">
            {words.map((word) => {
              const done = found.includes(word);
              return (
                <li
                  key={word}
                  className={`text-sm font-semibold tracking-wide ${
                    done ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {word}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {fill(g.found, { n: found.length, total: puzzle.placed.length })}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> {g.reset}
        </button>
      </div>
    </section>
    </GameRound>
  );
}
