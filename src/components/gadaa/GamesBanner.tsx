import banner from "@/assets/games/odaa-play-banner.jpg";
import { octbSourceUrl } from "@/lib/gadaa-data";
import { useI18n } from "@/lib/i18n";

export function GamesBanner() {
  const { t } = useI18n();

  return (
    <section className="relative w-full">
      <img
        src={banner}
        alt={t.quests.bannerAlt}
        className="block h-auto w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-transparent" />

      <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-center px-4 sm:px-6">
        <div className="max-w-xl pointer-events-auto">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase sm:text-xs">
            {t.quests.eyebrow}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">{t.quests.title}</h1>
          <p className="mt-1.5 text-xs text-foreground/90 sm:text-sm">{t.quests.intro}</p>
          {t.quests.source && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {t.quests.source}{" "}
              <a
                href={octbSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-gold underline-offset-2 hover:underline"
              >
                oromiatourism.gov.et
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
