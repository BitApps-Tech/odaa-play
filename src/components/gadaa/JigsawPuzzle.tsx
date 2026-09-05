import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { GameRound } from "./GameRound";
import { SiteScene } from "./SiteScene";
import { fill, useI18n } from "@/lib/i18n";
import { jigsawPath, makeJigsaw, type JigsawPiece } from "@/lib/jigsaw";
import { seededShuffle } from "@/lib/site-games";
import { sitePhotos } from "@/lib/site-photos";
import type { MapSiteType } from "@/lib/oromia-map";

const ROWS = 4;
const COLS = 4;
const LOOSE = 6;
const XP = 60;
const PUZZLES: MapSiteType[] = ["lake", "forest", "cave"];

function PieceFace({
  piece,
  src,
  className,
  clipPrefix,
}: {
  piece: JigsawPiece;
  src: string;
  className?: string;
  clipPrefix: string;
}) {
  const clipId = `${clipPrefix}-${piece.id}`;
  return (
    <svg viewBox="-22 -22 144 144" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d={jigsawPath(piece)} />
        </clipPath>
      </defs>
      <image
        href={src}
        x={-piece.col * 100}
        y={-piece.row * 100}
        width={COLS * 100}
        height={ROWS * 100}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <path d={jigsawPath(piece)} fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" />
    </svg>
  );
}

export function JigsawPuzzle() {
  const { t } = useI18n();
  const g = t.quests.pictorial;
  const [photoId, setPhotoId] = useState<MapSiteType>("lake");
  const photo = sitePhotos[photoId];
  const [src, setSrc] = useState(photo.fallback);
  const [progress, setProgress] = useState<Partial<Record<MapSiteType, number[]>>>({});
  const [drag, setDrag] = useState<{ id: number; x: number; y: number } | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);

  const pieces = useMemo(() => makeJigsaw(ROWS, COLS, `jigsaw-${photoId}`), [photoId]);
  const looseIds = useMemo(
    () => seededShuffle(pieces.map((p) => p.id), `loose-${photoId}`).slice(0, LOOSE),
    [pieces, photoId],
  );
  const starter = useMemo(
    () => pieces.map((p) => p.id).filter((id) => !looseIds.includes(id)),
    [pieces, looseIds],
  );
  const placed = progress[photoId] ?? starter;

  useEffect(() => {
    setSrc(photo.fallback);
    setDrag(null);
    setHoverSlot(null);
  }, [photo.fallback, photoId]);

  useEffect(() => {
    if (drag?.id == null) return;
    const id = drag.id;

    function slotAt(x: number, y: number) {
      const el = document.elementFromPoint(x, y);
      const slot = el?.closest("[data-jigsaw-slot]") as HTMLElement | null;
      const slotId = slot ? Number(slot.dataset["jigsawSlot"]) : NaN;
      return Number.isFinite(slotId) ? slotId : null;
    }

    function onMove(event: PointerEvent) {
      setDrag({ id, x: event.clientX, y: event.clientY });
      setHoverSlot(slotAt(event.clientX, event.clientY));
    }

    function onUp(event: PointerEvent) {
      const slotId = slotAt(event.clientX, event.clientY);
      if (slotId === id) {
        setProgress((current) => {
          const now = current[photoId] ?? starter;
          return {
            ...current,
            [photoId]: now.includes(slotId) ? now : [...now, slotId],
          };
        });
      }
      setDrag(null);
      setHoverSlot(null);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag?.id, photoId, starter]);

  const tray = looseIds.filter((id) => !placed.includes(id));
  const won = tray.length === 0 && placed.length === pieces.length;

  function reset() {
    setProgress({});
    setDrag(null);
    setHoverSlot(null);
  }

  function selectScene(id: MapSiteType) {
    setPhotoId(id);
    setDrag(null);
    setHoverSlot(null);
  }

  function onPointerDown(event: React.PointerEvent, id: number) {
    if (placed.includes(id)) return;
    event.preventDefault();
    setDrag({ id, x: event.clientX, y: event.clientY });
  }

  return (
    <GameRound id="jigsaw" won={won} xp={XP} onReset={reset}>
    <section className="mx-auto max-w-lg">
      <p className="text-sm text-muted-foreground">{g.jigsawIntro}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {PUZZLES.map((id) => {
          const active = photoId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectScene(id)}
              className={`overflow-hidden rounded-xl text-left ring-1 transition-colors ${
                active ? "ring-gold/70" : "ring-border hover:ring-primary/40"
              }`}
            >
              <span className="block aspect-[8/5] overflow-hidden">
                <SiteScene type={id} title={sitePhotos[id].place} />
              </span>
              <span
                className={`block truncate px-2 py-1.5 text-[11px] font-semibold ${
                  active ? "bg-gold/15 text-gold" : "bg-secondary"
                }`}
              >
                {sitePhotos[id].place}
              </span>
            </button>
          );
        })}
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
        <div className="relative aspect-square w-full max-w-[17.5rem] overflow-hidden rounded-lg bg-white ring-1 ring-border">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("${src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {pieces.map((piece) => {
              const isPlaced = placed.includes(piece.id);
              return (
                <div
                  key={piece.id}
                  data-jigsaw-slot={piece.id}
                  className={`relative ${
                    !isPlaced && hoverSlot === piece.id ? "z-10" : ""
                  }`}
                >
                  {isPlaced ? (
                    <PieceFace
                      piece={piece}
                      src={src}
                      clipPrefix={`board-${photoId}`}
                      className="pointer-events-none absolute top-1/2 left-1/2 h-[165%] w-[165%] -translate-x-1/2 -translate-y-1/2"
                    />
                  ) : (
                    <svg viewBox="-22 -22 144 144" className="pointer-events-none absolute inset-0 h-full w-full">
                      <path
                        d={jigsawPath(piece)}
                        fill={hoverSlot === piece.id ? "#e8d7a8" : "#f4f1ea"}
                        stroke={hoverSlot === piece.id ? "#c9a227" : "#d4c4a8"}
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full max-w-[17.5rem] flex-row flex-wrap content-start justify-center gap-1.5 rounded-lg bg-secondary/50 p-1.5 sm:w-[4.25rem] sm:max-w-none sm:flex-col">
          {tray.map((id) => {
            const piece = pieces[id]!;
            return (
              <button
                key={id}
                type="button"
                onPointerDown={(e) => onPointerDown(e, id)}
                className={`relative h-14 w-14 touch-none ${
                  drag?.id === id ? "opacity-30" : ""
                }`}
                aria-label={g.jigsawHint}
              >
                <PieceFace piece={piece} src={src} clipPrefix={`tray-${photoId}`} className="h-full w-full drop-shadow" />
              </button>
            );
          })}
          {tray.length === 0 && !won && <p className="p-1.5 text-[11px] text-muted-foreground">{g.jigsawHint}</p>}
        </div>
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
          style={{ left: drag.x, top: drag.y }}
        >
          <PieceFace
            piece={pieces[drag.id]!}
            src={src}
            clipPrefix={`drag-${photoId}`}
            className="h-full w-full drop-shadow-lg"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{fill(g.jigsawPieces, { n: tray.length })}</p>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> {g.jigsawReset}
        </button>
      </div>
      </div>
    </section>
    </GameRound>
  );
}
