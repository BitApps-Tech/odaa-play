import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { Page } from "@/components/gadaa/Page";
import { SiteGames } from "@/components/gadaa/SiteGames";
import { fill, useI18n } from "@/lib/i18n";
import {
  mapSiteTypes,
  mapSites,
  oromiaTouristMap,
  touristMapEmbed,
  type MapSite,
  type MapSiteType,
} from "@/lib/oromia-map";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [{ title: "Map — Odaa Play" }],
  }),
  validateSearch: (search: Record<string, unknown>): { site?: string } => {
    const site = search["site"];
    if (typeof site === "string" && site.length > 0) {
      return { site };
    }
    return {};
  },
  component: TourismMap,
});

function siteMeta(site: MapSite) {
  const zone = site.zone.replace(/\s+/g, " ").trim();
  const woreda = site.woreda.replace(/\s+/g, " ").trim();
  const zoneOk = zone.length > 1 && zone.length < 28 && !/Opening|of the|Regional State/i.test(zone);
  const woredaOk = woreda.length > 1 && woreda.length < 36 && !/Opening|Information/i.test(woreda);
  return [zoneOk ? zone : "", woredaOk ? woreda : ""].filter(Boolean).join(" · ");
}

function TourismMap() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { site: siteParam } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<MapSiteType | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(siteParam ?? null);

  useEffect(() => {
    if (siteParam) {
      setActiveId(siteParam);
    }
  }, [siteParam]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mapSites.filter((site) => {
      if (type !== "all" && site.type !== type) return false;
      if (!q) return true;
      return [site.name, site.zone, site.woreda, site.summary, site.type].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [query, type]);

  const active = mapSites.find((s) => s.id === activeId) ?? null;
  const embedSrc = touristMapEmbed(active?.lat, active?.lng, active ? 11 : 7);

  function selectSite(id: string) {
    setActiveId(id);
    void navigate({ to: "/map", search: { site: id }, replace: true });
  }

  return (
    <Page eyebrow={t.map.eyebrow} title={t.map.title} intro={t.map.intro} source={t.map.source}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(20rem,1fr)]">
        <div className="space-y-3">
          <div className="glass shadow-panel relative aspect-[4/3] w-full overflow-hidden rounded-3xl lg:aspect-auto lg:min-h-[40rem]">
            <iframe
              key={embedSrc}
              title={oromiaTouristMap.title}
              src={embedSrc}
              className="h-full min-h-[22rem] w-full border-0 lg:min-h-[40rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-xs text-muted-foreground">{t.map.panHint}</p>
            <a
              href={oromiaTouristMap.viewerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
            >
              {t.map.openFullMap} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <aside className="glass flex max-h-[40rem] flex-col overflow-hidden rounded-3xl">
          <div className="border-b border-border p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.map.search}
                className="w-full rounded-xl bg-secondary py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                onClick={() => setType("all")}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  type === "all" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"
                }`}
              >
                {t.map.allTypes}
              </button>
              {mapSiteTypes.map((id) => (
                <button
                  key={id}
                  onClick={() => setType(id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    type === id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"
                  }`}
                >
                  {t.map.types[id] ?? id}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-semibold tracking-wide text-gold uppercase">
              {fill(t.map.sitesCount, { n: filtered.length })}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">{t.map.noResults}</p>
            ) : (
              filtered.map((site) => {
                const meta = siteMeta(site);
                return (
                  <button
                    key={site.id}
                    onClick={() => selectSite(site.id)}
                    className={`flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      site.id === activeId ? "bg-primary/15" : "hover:bg-accent"
                    }`}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{site.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {t.map.types[site.type] ?? site.type}
                        {meta ? ` · ${meta}` : ""}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>
      </div>

      {active && (
        <section className="glass rounded-3xl p-6">
          <p className="text-xs tracking-widest text-gold uppercase">
            {t.map.types[active.type] ?? active.type}
            {siteMeta(active) ? ` · ${siteMeta(active)}` : ""}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{active.name}</h2>
          {active.summary && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{active.summary}</p>}
          <SiteGames key={active.id} site={active} />
        </section>
      )}

      {!active && (
        <section className="glass rounded-3xl p-6 text-sm text-muted-foreground">{t.map.pickSite}</section>
      )}
    </Page>
  );
}
