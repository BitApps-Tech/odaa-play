import { Sparkles } from "lucide-react";
import { SiteScene } from "./SiteScene";
import type { MapSiteType } from "@/lib/oromia-map";

export function PicturePick({
  question,
  options,
  answer,
  labels,
  choice,
  onChoose,
  xp,
  correctLabel,
  wrongLabel,
}: {
  question: string;
  options: MapSiteType[];
  answer: MapSiteType;
  labels: Record<string, string>;
  choice: MapSiteType | null;
  onChoose: (type: MapSiteType) => void;
  xp: number;
  correctLabel: string;
  wrongLabel: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{question}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {options.map((type) => {
          const state =
            choice === null ? "idle" : type === answer ? "right" : type === choice ? "wrong" : "idle";
          return (
            <button
              key={type}
              onClick={() => onChoose(type)}
              className={`overflow-hidden rounded-2xl text-left ring-1 transition-colors ${
                state === "right"
                  ? "ring-gold/70"
                  : state === "wrong"
                    ? "ring-primary/70"
                    : "ring-border hover:ring-primary/40"
              }`}
            >
              <SiteScene type={type} title={labels[type] ?? type} className="aspect-[8/5] w-full" />
              <span
                className={`block px-3 py-2 text-xs font-semibold ${
                  state === "right" ? "bg-gold/20 text-gold" : state === "wrong" ? "bg-primary/15" : "bg-secondary"
                }`}
              >
                {labels[type] ?? type}
              </span>
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <p className="animate-rise mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          {choice === answer ? correctLabel.replace("{xp}", String(xp)) : wrongLabel}
        </p>
      )}
    </div>
  );
}
