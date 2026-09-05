import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AccountMenu } from "./AccountMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OdaaLogo } from "./OdaaLogo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useI18n } from "@/lib/i18n";

const linkKeys = [
  { to: "/", key: "dashboard" },
  { to: "/quests", key: "quests" },
  { to: "/map", key: "map" },
  { to: "/heritage", key: "heritage" },
  { to: "/ai-guide", key: "aiGuide" },
] as const;

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="flex h-1">
        <span className="flex-1 bg-[oklch(0.14_0.01_265)]" />
        <span className="flex-1 bg-primary" />
        <span className="flex-1 bg-white" />
      </div>

      <div className="glass-strong shadow-panel">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-panel ring-1 ring-border">
              <OdaaLogo className="h-11 w-11" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-tight font-bold">
                {t.brand.name}
              </span>
              <span className="block truncate text-[11px] tracking-wide text-muted-foreground uppercase">
                {t.brand.bureau}
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {linkKeys.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{
                  className:
                    "bg-primary/15 text-foreground ring-1 ring-primary/50 shadow-glow",
                }}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.nav[l.key]}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <AccountMenu />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={t.nav.menu}
              className="glass grid h-10 w-10 place-items-center rounded-xl lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="animate-rise grid gap-1 border-t border-border px-4 pt-2 pb-4 lg:hidden">
            {linkKeys.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-primary/15 text-foreground" }}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
              >
                {t.nav[l.key]}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
